import type { AppEnv } from './types';

export async function getSiteConfig(env: AppEnv) {
  const raw = await env.CONFIG_KV.get('site:config', 'json');
  return (
    raw ?? {
      siteName_en: 'HyperVision LED',
      siteName_zh: 'HyperVision LED',
      supportEmail: 'sales@hypervision-led.com',
      supportPhone: '+86-755-0000-0000',
      address_en: 'Shenzhen, Guangdong, China',
      address_zh: '中国广东深圳',
      heroTitle_en: 'Industrial LED Display Solutions for Global Brands',
      heroTitle_zh: '面向全球品牌的工业级 LED 显示方案',
    }
  );
}

export async function getCachedJson<T>(env: AppEnv, key: string): Promise<T | null> {
  return env.CONFIG_KV.get(`cache:${key}`, 'json');
}

export async function setCachedJson<T>(
  env: AppEnv,
  key: string,
  value: T,
  ttlSeconds: number,
) {
  await env.CONFIG_KV.put(`cache:${key}`, JSON.stringify(value), { expirationTtl: ttlSeconds });
}
