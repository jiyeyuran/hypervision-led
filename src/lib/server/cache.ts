import type { AppEnv } from './types';

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
