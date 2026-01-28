/**
 * Cloudflare Pages Function for /list and /list/[category]
 *
 * Intercepts list view URLs and returns index.html.
 *
 * [[category]] matches:
 *   /list           → category = undefined
 *   /list/citizens  → category = ['citizens']
 */

export async function onRequest(context) {
  const { params } = context;
  const categorySegments = params.category || [];
  const category = categorySegments[0] || null;

  // Fetch the base index.html
  const baseUrl = new URL(context.request.url);
  baseUrl.pathname = '/index.html';

  const indexResponse = await fetch(baseUrl.toString());
  let html = await indexResponse.text();

  // Build OG meta tags
  const ogTags = buildListOgTags(baseUrl.origin, category);

  // Inject OG tags into <head>
  html = injectOgTags(html, ogTags);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function buildListOgTags(origin, category) {
  const categories = {
    'citizens': {
      title: 'U.S. Citizens & Legal Residents',
      description: 'Documented incidents of U.S. citizens and legal residents wrongly detained or stopped by ICE in Minnesota.',
    },
    'observers': {
      title: 'Observers & Protesters',
      description: 'Documented incidents of observers and protesters arrested or attacked during ICE operations in Minnesota.',
    },
    'immigrants': {
      title: 'Community Members',
      description: 'Documented incidents of non-criminal community members detained by ICE in Minnesota.',
    },
    'schools': {
      title: 'Schools & Hospitals',
      description: 'Documented ICE/CBP actions at schools and hospitals in Minnesota.',
    },
    'response': {
      title: 'Official Federal Response',
      description: 'DHS and ICE official statements regarding Minnesota enforcement operations.',
    },
  };

  const categoryInfo = category ? categories[category] : null;

  const title = categoryInfo
    ? `${categoryInfo.title} | MN ICE Witness`
    : 'All Incidents | MN ICE Witness';

  const description = categoryInfo
    ? categoryInfo.description
    : 'Complete list of documented ICE and CBP civil rights incidents in Minnesota during Operation Metro Surge.';

  const url = category
    ? `${origin}/list/${category}`
    : `${origin}/list`;

  return {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': `${origin}/assets/og-image.jpg`,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': `${origin}/assets/og-image.jpg`,
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
    html = html.replace('</head>', `${metaTags}\n</head>`);
  }

  return html;
}
