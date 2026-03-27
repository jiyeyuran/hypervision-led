export function GET() {
  const content = `User-agent: *
Allow: /
Sitemap: https://www.hypervision-led.com/sitemap-index.xml`;
  return new Response(content, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
