/**
 * Cloudflare Pages Function for /unverified
 *
 * Intercepts the unverified page URL, injects Open Graph meta tags for social media sharing,
 * and returns the main index.html.
 */

export async function onRequest(context) {
  // Fetch the base index.html
  const baseUrl = new URL(context.request.url);
  baseUrl.pathname = '/index.html';

  const indexResponse = await fetch(baseUrl.toString());
  let html = await indexResponse.text();

  // Build OG meta tags for unverified page
  const ogTags = buildUnverifiedOgTags(baseUrl.origin);

  // Inject OG tags into <head>
  html = injectOgTags(html, ogTags);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function buildUnverifiedOgTags(origin) {
  const title = 'Unverified Reports | MN ICE Witness';
  const description = 'Reports we are seeking to verify. Help us confirm these incidents with news articles, photos, videos, or first-hand accounts.';
  const url = `${origin}/unverified`;

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
