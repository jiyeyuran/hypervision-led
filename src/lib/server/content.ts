import type { AppEnv } from './types';
import { getCachedJson, setCachedJson } from './cache';
import { execute, queryAll, queryFirst } from './db';

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
  cover_image: string | null;
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
      `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh, cover_image, published_at
       FROM blog_posts
       WHERE slug = ? AND is_published = 1
       LIMIT 1`,
      [slug],
    ),
  );
}

export interface AdminBlogRow extends BlogCard {
  cover_image: string | null;
  is_published: number;
  updated_at: string;
}

export interface AdminBlogDetail extends AdminBlogRow {
  content_en: string;
  content_zh: string;
}

export interface BlogUpsertInput {
  id?: string;
  slug: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  content_en: string;
  content_zh: string;
  cover_image?: string | null;
  is_published: boolean;
  published_at?: string | null;
}

export async function listAdminBlogs(env: AppEnv): Promise<AdminBlogRow[]> {
  return queryAll<AdminBlogRow>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, cover_image, is_published, published_at, updated_at
     FROM blog_posts
     ORDER BY published_at DESC`,
  );
}

export async function getAdminBlog(env: AppEnv, id: string): Promise<AdminBlogDetail | null> {
  return queryFirst<AdminBlogDetail>(
    env,
    `SELECT id, slug, title_en, title_zh, excerpt_en, excerpt_zh, content_en, content_zh,
            cover_image, is_published, published_at, updated_at
     FROM blog_posts
     WHERE id = ?
     LIMIT 1`,
    [id],
  );
}

async function invalidateBlogCache(env: AppEnv, slug?: string) {
  await env.CONFIG_KV.delete('cache:blogs:list');
  if (slug) {
    await env.CONFIG_KV.delete(`cache:blog:${slug}`);
  }
}

function randomId(prefix: string): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  return `${prefix}_${random}`;
}

export async function createBlog(env: AppEnv, input: BlogUpsertInput): Promise<AdminBlogDetail> {
  const id = input.id ?? randomId('blog');
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const publishedAt = input.published_at ?? now;
  await execute(
    env,
    `INSERT INTO blog_posts (
        id, slug, title_en, title_zh, excerpt_en, excerpt_zh,
        content_en, content_zh, cover_image, is_published, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.slug,
      input.title_en,
      input.title_zh,
      input.excerpt_en,
      input.excerpt_zh,
      input.content_en,
      input.content_zh,
      input.cover_image ?? null,
      input.is_published ? 1 : 0,
      publishedAt,
    ],
  );
  await invalidateBlogCache(env, input.slug);
  const row = await getAdminBlog(env, id);
  if (!row) {
    throw new Error('Failed to read blog after insert');
  }
  return row;
}

export async function updateBlog(
  env: AppEnv,
  id: string,
  input: BlogUpsertInput,
): Promise<AdminBlogDetail> {
  const existing = await getAdminBlog(env, id);
  if (!existing) {
    throw new Error('Blog not found');
  }
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const publishedAt = input.published_at ?? existing.published_at;
  await execute(
    env,
    `UPDATE blog_posts
     SET slug = ?, title_en = ?, title_zh = ?, excerpt_en = ?, excerpt_zh = ?,
         content_en = ?, content_zh = ?, cover_image = ?, is_published = ?,
         published_at = ?, updated_at = ?
     WHERE id = ?`,
    [
      input.slug,
      input.title_en,
      input.title_zh,
      input.excerpt_en,
      input.excerpt_zh,
      input.content_en,
      input.content_zh,
      input.cover_image ?? null,
      input.is_published ? 1 : 0,
      publishedAt,
      now,
      id,
    ],
  );
  await invalidateBlogCache(env, existing.slug);
  if (existing.slug !== input.slug) {
    await invalidateBlogCache(env, input.slug);
  }
  const row = await getAdminBlog(env, id);
  if (!row) {
    throw new Error('Failed to read blog after update');
  }
  return row;
}

export async function deleteBlog(env: AppEnv, id: string): Promise<boolean> {
  const existing = await getAdminBlog(env, id);
  if (!existing) {
    return false;
  }
  await execute(env, 'DELETE FROM blog_posts WHERE id = ?', [id]);
  await invalidateBlogCache(env, existing.slug);
  return true;
}
