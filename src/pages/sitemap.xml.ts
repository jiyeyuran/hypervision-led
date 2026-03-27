import type { APIRoute } from 'astro';
import { getBlogs, getProducts } from '../lib/server/content';

const site = 'https://www.hypervision-led.com';

function url(loc: string, lastmod?: string) {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
}

export const GET: APIRoute = async ({ locals }) => {
  const env = locals.runtime.env;
  const products = await getProducts(env);
  const posts = await getBlogs(env);

  const fixedPaths = ['/', '/about', '/products', '/blog', '/contact', '/inquiry'];
  const allUrls = [
    ...fixedPaths.map((path) => url(`${site}${path}`)),
    ...fixedPaths.map((path) => url(`${site}/zh${path === '/' ? '' : path}`)),
    ...products.map((item) => url(`${site}/products/${item.slug}`)),
    ...products.map((item) => url(`${site}/zh/products/${item.slug}`)),
    ...posts.map((item) => url(`${site}/blog/${item.slug}`, item.published_at.slice(0, 10))),
    ...posts.map((item) => url(`${site}/zh/blog/${item.slug}`, item.published_at.slice(0, 10))),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${allUrls.join('')}</urlset>`;
  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
};
