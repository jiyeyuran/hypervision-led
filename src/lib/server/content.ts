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

export async function getProducts(env: AppEnv): Promise<ProductCard[]> {
  const cacheKey = 'products:list';
  const cached = await getCachedJson<ProductCard[]>(env, cacheKey);
  if (cached) {
    return cached;
  }
  const rows = await queryAll<ProductCard>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, cover_image
     FROM products
     WHERE is_published = 1
     ORDER BY sort_order ASC, created_at DESC`,
  );
  await setCachedJson(env, cacheKey, rows, 120);
  return rows;
}

export async function getProductBySlug(env: AppEnv, slug: string): Promise<ProductDetail | null> {
  return queryFirst<ProductDetail>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, cover_image, brochure_key
     FROM products
     WHERE slug = ? AND is_published = 1
     LIMIT 1`,
    [slug],
  );
}

export async function getBlogs(env: AppEnv): Promise<BlogCard[]> {
  return queryAll<BlogCard>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, published_at
     FROM blog_posts
     WHERE is_published = 1
     ORDER BY published_at DESC`,
  );
}

export async function getBlogBySlug(env: AppEnv, slug: string): Promise<BlogDetail | null> {
  return queryFirst<BlogDetail>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, published_at
     FROM blog_posts
     WHERE slug = ? AND is_published = 1
     LIMIT 1`,
    [slug],
  );
}
