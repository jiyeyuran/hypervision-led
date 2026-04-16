import type { AppEnv } from './types';
import { getCachedJson, setCachedJson } from './cache';
import { queryAll, queryFirst } from './db';

export interface ProductCard {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  cover_image: string | null;
}

export interface BlogCard {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  published_at: string;
}

export interface ProductDetail extends ProductCard {
  content_en: string;
  content_zh: string;
  brochure_key: string | null;
}

export interface BlogDetail extends BlogCard {
  content_en: string;
  content_zh: string;
}

const CACHE_TTL_LIST = 120;
const CACHE_TTL_DETAIL = 60;

async function cached<T>(
  env: AppEnv,
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const hit = await getCachedJson<T>(env, key);
  if (hit !== null) {
    return hit;
  }
  const data = await fetcher();
  if (data !== null) {
    await setCachedJson(env, key, data, ttl);
  }
  return data;
}

export async function getProducts(env: AppEnv): Promise<ProductCard[]> {
  return cached(env, 'products:list', CACHE_TTL_LIST, () =>
    queryAll<ProductCard>(
      env,
      `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, cover_image
       FROM products
       WHERE is_published = 1
       ORDER BY sort_order ASC, created_at DESC`,
    ),
  );
}

export async function getProductBySlug(env: AppEnv, slug: string): Promise<ProductDetail | null> {
  return cached(env, `product:${slug}`, CACHE_TTL_DETAIL, () =>
    queryFirst<ProductDetail>(
      env,
      `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, cover_image, brochure_key
       FROM products
       WHERE slug = ? AND is_published = 1
       LIMIT 1`,
      [slug],
    ),
  );
}

export async function getBlogs(env: AppEnv): Promise<BlogCard[]> {
  return cached(env, 'blogs:list', CACHE_TTL_LIST, () =>
    queryAll<BlogCard>(
      env,
      `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, published_at
       FROM blog_posts
       WHERE is_published = 1
       ORDER BY published_at DESC`,
    ),
  );
}

export async function getBlogBySlug(env: AppEnv, slug: string): Promise<BlogDetail | null> {
  return cached(env, `blog:${slug}`, CACHE_TTL_DETAIL, () =>
    queryFirst<BlogDetail>(
      env,
      `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, published_at
       FROM blog_posts
       WHERE slug = ? AND is_published = 1
       LIMIT 1`,
      [slug],
    ),
  );
}
