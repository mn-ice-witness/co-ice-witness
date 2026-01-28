/**
 * Cloudflare Pages Function for /summaries/[date]
 *
 * Serves index.html with custom og:tags for the summary date.
 * Date format: YYYY-MM-DD
 * Uses the date-specific og-image from /summary-og-images/
 */

export async function onRequest(context) {
  const { params } = context;
  const dateStr = params.date; // YYYY-MM-DD

  const baseUrl = new URL(context.request.url);
  baseUrl.pathname = '/index.html';

  const indexResponse = await fetch(baseUrl.toString());
  let html = await indexResponse.text();

  const ogTags = buildOgTags(dateStr, baseUrl.origin);
  html = injectOgTags(html, ogTags);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function buildOgTags(dateStr, origin) {
  const url = `${origin}/summaries/${dateStr}/`;
  const title = `Summary: ${formatDate(dateStr)}`;
  const description = `Incidents added or updated on ${formatDate(dateStr)} documenting ICE/CBP civil rights incidents in Minnesota.`;
  const image = `${origin}/summary-og-images/${dateStr}.jpg`;

  return {
    'og:title': `${title} | MN ICE Witness`,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': `${title} | MN ICE Witness`,
    'twitter:description': description,
    'twitter:image': image,
  };
}

function formatDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} ${parseInt(day, 10)}, ${year}`;
    }
  }
  return dateStr;
}

function injectOgTags(html, tags) {
  const metaTags = Object.entries(tags).map(([key, value]) => {
    const escapedValue = value.replace(/"/g, '&quot;');
    if (key.startsWith('og:')) {
      return `    <meta property="${key}" content="${escapedValue}">`;
    } else {
      return `    <meta name="${key}" content="${escapedValue}">`;
    }
  }).join('\n');

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
