import type { AppEnv } from './types';

export function getEnv(context: { env: unknown }): AppEnv {
  return context.env as AppEnv;
}

export function getClientIp(request: any): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  );
}
