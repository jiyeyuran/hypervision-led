import { createRemoteJWKSet, jwtVerify } from 'jose';
import { queryFirst } from './db';
import type { AppEnv } from './types';
import { CF_ACCESS_TEAM_DOMAIN } from '../access-config';

export interface AdminIdentity {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

const CF_ACCESS_CERTS_URL = `https://${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`;
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

  // 第一道门：allowlist（环境变量）只决定"谁能登录后台"。
  const allowlist = parseAllowlist(env.ADMIN_ALLOWLIST);
  const isAllowlisted = allowlist.size === 0 || allowlist.has(email);
  if (!isAllowlisted) {
    return null;
  }

  // 第二道门：真正的角色由 admin_users 决定。未建表（常见于首次登录）则默认 editor，
  // 足以写博客 / 上传资源；admin 专属操作（如删除）仍需手动在 admin_users 里升级。
  // is_active = 0 视为主动停用，直接拒绝。
  const user = await queryFirst<{ role: AdminIdentity['role']; is_active: number }>(
    env,
    `SELECT role, is_active
     FROM admin_users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );
  if (user && user.is_active === 0) {
    return null;
  }
  const role: AdminIdentity['role'] = user?.role ?? 'editor';
  if (!roles.includes(role)) {
    return null;
  }

  return { email, role };
}
