import type { AppEnv } from './types';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_UPLOAD_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]);

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function rateLimit(
  env: AppEnv,
  bucket: string,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const cacheKey = `rl:${bucket}:${key}`;
  const countRaw = await env.RATE_LIMIT_KV.get(cacheKey);
  const count = Number(countRaw ?? '0');
  if (count >= limit) {
    return { allowed: false, retryAfterSeconds: windowSeconds };
  }
  await env.RATE_LIMIT_KV.put(cacheKey, String(count + 1), { expirationTtl: windowSeconds });
  return { allowed: true, retryAfterSeconds: 0 };
}

export function validateHoneypot(value?: string | null): boolean {
  return !value || value.trim() === '';
}

export function validateFormRenderTime(renderedAt: number): boolean {
  const now = Date.now();
  return now - renderedAt >= 2500;
}

export async function verifyTurnstileToken(
  env: AppEnv,
  token: string | null,
  remoteIp: string,
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) {
    return true;
  }
  if (!token) {
    return false;
  }
  const body = new URLSearchParams();
  body.set('secret', env.TURNSTILE_SECRET_KEY);
  body.set('response', token);
  body.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) {
    return false;
  }
  const payload = (await response.json()) as { success?: boolean };
  return Boolean(payload.success);
}

export function validateUploadFile(file: File): { ok: boolean; message?: string } {
  if (file.size > MAX_UPLOAD_SIZE) {
    return { ok: false, message: 'Attachment exceeds 5MB limit.' };
  }
  if (!ALLOWED_UPLOAD_TYPES.has(file.type)) {
    return { ok: false, message: 'Unsupported attachment type.' };
  }
  return { ok: true };
}
