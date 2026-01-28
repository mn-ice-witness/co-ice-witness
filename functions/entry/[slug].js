/**
 * Cloudflare Pages Function for /entry/[slug]
 *
 * Intercepts entry URLs, injects Open Graph meta tags for social media sharing,
 * and returns the main index.html with the appropriate meta tags for the specific entry.
 */

export async function onRequest(context) {
  const { params, env } = context;
  const slug = params.slug;
  const baseUrl = new URL(context.request.url);

  // Check for redirects first
  const redirectUrl = new URL(context.request.url);
  redirectUrl.pathname = '/data/redirects.json';

  try {
    const redirectResponse = await fetch(redirectUrl.toString());
    const redirectData = await redirectResponse.json();

    if (redirectData.redirects && redirectData.redirects[slug]) {
      const newSlug = redirectData.redirects[slug];
      return Response.redirect(`${baseUrl.origin}/entry/${newSlug}`, 301);
    }
  } catch (e) {
    // If redirect fetch fails, continue without redirecting
  }

  // Fetch the base index.html
  baseUrl.pathname = '/index.html';

  const indexResponse = await fetch(baseUrl.toString());
  let html = await indexResponse.text();

  // Fetch incidents data to find the matching incident
  const dataUrl = new URL(context.request.url);
  dataUrl.pathname = '/data/incidents-summary.json';

  try {
    const dataResponse = await fetch(dataUrl.toString());
    const data = await dataResponse.json();

    // Find incident by slug (the part after YYYY-MM-DD- in the filename)
    const incident = data.incidents.find(i => {
      const incidentSlug = i.filePath.split('/').pop().replace('.md', '');
      return incidentSlug === slug;
    });

    if (incident) {
      // Build OG meta tags for this incident
      const ogTags = buildOgTags(incident, baseUrl.origin, slug);

      // Inject OG tags into <head> (replace existing generic ones)
      html = injectOgTags(html, ogTags);
    }
    // If incident not found, return page anyway (JS will show 404 lightbox)

  } catch (e) {
    // If data fetch fails, return unmodified index.html
    console.error('Failed to fetch incident data:', e);
  }

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function buildOgTags(incident, origin, slug) {
  const title = incident.title;
  const description = incident.summary.length > 200
    ? incident.summary.substring(0, 197) + '...'
    : incident.summary;
  const url = `${origin}/entry/${slug}`;

  // Determine og:image - use local media if available, otherwise default
  let image = `${origin}/assets/og-image.jpg`;
  if (incident.hasLocalMedia) {
    if (incident.localMediaType === 'image') {
      image = `${origin}/${incident.localMediaPath}`;
    } else if (incident.localMediaType === 'video' && incident.localMediaOgPath) {
      // Videos have a generated OG image with timestamp (e.g., incident-og-2s.jpg)
      image = `${origin}/${incident.localMediaOgPath}`;
    }
  }

  return {
    'og:title': `${title} | MN ICE Witness`,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:type': 'article',
    'twitter:card': 'summary_large_image',
    'twitter:title': `${title} | MN ICE Witness`,
    'twitter:description': description,
    'twitter:image': image,
  };
}

function injectOgTags(html, tags) {
  // Build new meta tags string
  const metaTags = Object.entries(tags).map(([key, value]) => {
    const escapedValue = value.replace(/"/g, '&quot;');
    if (key.startsWith('og:')) {
      return `    <meta property="${key}" content="${escapedValue}">`;
    } else {
      return `    <meta name="${key}" content="${escapedValue}">`;
    }
  }).join('\n');

  // Replace the entire OG/Twitter section in one operation
  if (html.includes('<!-- Open Graph / Social Media -->')) {
    html = html.replace(
      /<!-- Open Graph \/ Social Media -->[\s\S]*?<!-- Twitter Card -->[\s\S]*?<meta name="twitter:image"[^>]*>/,
      `<!-- Open Graph / Social Media -->\n${metaTags}`
    );
  } else {
    // Fallback: inject before </head>
    html = html.replace('</head>', `${metaTags}\n</head>`);
  }

  return html;
}
