import { createRemoteJWKSet, jwtVerify } from 'jose';
import { queryFirst } from './db';
import type { AppEnv } from './types';

export interface AdminIdentity {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

const CF_ACCESS_CERTS_URL = 'https://hypervision-led.cloudflareaccess.com/cdn-cgi/access/certs';
const jwks = createRemoteJWKSet(new URL(CF_ACCESS_CERTS_URL));

function parseAllowlist(raw: string): Set<string> {
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdmin(
  request: Request,
  env: AppEnv,
  roles: Array<AdminIdentity['role']> = ['admin', 'editor', 'viewer'],
): Promise<AdminIdentity | null> {
  // 本地开发时跳过 Cloudflare Access 认证
  if (import.meta.env.DEV) {
    return { email: 'admin@hypervision-led.com', role: 'admin' };
  }

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) {
    return null;
  }

  let email: string;
  try {
    const { payload } = await jwtVerify(token, jwks, {
      audience: env.CF_ACCESS_AUD || undefined,
    });
    email = String(payload.email ?? '').toLowerCase();
  } catch {
    return null;
  }

  if (!email) {
    return null;
  }

  const allowlist = parseAllowlist(env.ADMIN_ALLOWLIST);
  if (allowlist.size > 0 && !allowlist.has(email)) {
    return null;
  }

  const user = await queryFirst<{ role: AdminIdentity['role'] }>(
    env,
    `SELECT role
     FROM admin_users
     WHERE email = ? AND is_active = 1
     LIMIT 1`,
    [email],
  );
  const role = user?.role ?? 'viewer';
  if (!roles.includes(role)) {
    return null;
  }

  return { email, role };
}
