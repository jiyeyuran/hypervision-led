import { decodeJwt } from 'jose';
import { queryFirst } from './db';
import type { AppEnv } from './types';

export interface AdminIdentity {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

function parseAllowlist(raw: string): Set<string> {
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function requireAdmin(
  request: any,
  env: AppEnv,
  roles: Array<AdminIdentity['role']> = ['admin', 'editor', 'viewer'],
): Promise<AdminIdentity | null> {
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (!jwt) {
    return null;
  }

  const payload = decodeJwt(jwt);
  const aud = payload.aud;
  const audMatched = Array.isArray(aud) ? aud.includes(env.CF_ACCESS_AUD) : aud === env.CF_ACCESS_AUD;
  if (!audMatched) {
    return null;
  }

  const email = String(payload.email ?? '').toLowerCase();
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
