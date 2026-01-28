/**
 * Cloudflare Pages Function for /about and /about/[section]
 *
 * Intercepts about page URLs, injects Open Graph meta tags for social media sharing,
 * and returns the main index.html.
 *
 * [[path]] is a catch-all that matches:
 *   /about         → path = undefined
 *   /about/sources → path = ['sources']
 */

export async function onRequest(context) {
  const { params } = context;
  const pathSegments = params.path || [];
  const section = pathSegments[0] || null;

  // Fetch the base index.html
  const baseUrl = new URL(context.request.url);
  baseUrl.pathname = '/index.html';

  const indexResponse = await fetch(baseUrl.toString());
  let html = await indexResponse.text();

  // Build OG meta tags for about page
  const ogTags = buildAboutOgTags(baseUrl.origin, section);

  // Inject OG tags into <head>
  html = injectOgTags(html, ogTags);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function buildAboutOgTags(origin, section) {
  // Section-specific titles and descriptions
  const sections = {
    'federal-position': {
      title: 'Federal Position',
      description: 'Understanding the official federal position on ICE enforcement operations in Minnesota.',
    },
    'the-data': {
      title: 'The Data',
      description: 'How we collect, verify, and present incident data from ICE operations in Minnesota.',
    },
    'what-this-site-documents': {
      title: 'What This Site Documents',
      description: 'Categories of civil rights incidents documented by MN ICE Witness.',
    },
    'purpose': {
      title: 'Purpose',
      description: 'Why MN ICE Witness exists and what we aim to accomplish.',
    },
    'sources-used': {
      title: 'Sources Used',
      description: 'The news sources and documentation standards used by MN ICE Witness.',
    },
    'investigations': {
      title: 'Investigations',
      description: 'Ongoing investigations into ICE civil rights incidents in Minnesota.',
    },
    'operation-parris': {
      title: 'Operation Parris',
      description: 'Information about Operation Parris and ICE enforcement in Minnesota.',
    },
    'trustworthiness': {
      title: 'Trustworthiness Ratings',
      description: 'How MN ICE Witness rates the reliability of incident reports.',
    },
    'legal-observation': {
      title: 'Legal Observation',
      description: 'Know your rights when observing ICE operations.',
    },
  };

  const sectionInfo = section ? sections[section] : null;

  const title = sectionInfo
    ? `${sectionInfo.title} | About | MN ICE Witness`
    : 'About | MN ICE Witness';

  const description = sectionInfo
    ? sectionInfo.description
    : 'About MN ICE Witness - a sourced database documenting ICE and CBP civil rights incidents in Minnesota during Operation Metro Surge.';

  const url = section
    ? `${origin}/about/${section}`
    : `${origin}/about`;

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
