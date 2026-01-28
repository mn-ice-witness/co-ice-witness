/**
 * Cloudflare Pages Function for /new-updated/[date]
 *
 * Redirects old URLs to new /summaries/ URLs.
 * Old format: /new-updated/MM-DD-YYYY
 * New format: /summaries/YYYY-MM-DD/
 */

export async function onRequest(context) {
  const { params } = context;
  const dateStr = params.date; // MM-DD-YYYY

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    const isoDate = `${year}-${month}-${day}`;
    const newUrl = `/summaries/${isoDate}/`;

    return Response.redirect(new URL(newUrl, context.request.url).toString(), 301);
  }

  return new Response('Invalid date format. Expected: MM-DD-YYYY', { status: 400 });
}
