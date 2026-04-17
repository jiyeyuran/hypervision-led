import { getWorkerEnv } from './server/worker-env';

/**
 * 从 Worker 环境变量读取 Turnstile 站点公钥（本地 `.dev.vars`，生产 `wrangler.toml` 的 `[vars]`）。
 * 未配置时返回空串，前端 Turnstile widget 会因缺失 sitekey 不渲染。
 */
export function getTurnstileSiteKey(): string {
  return getWorkerEnv().TURNSTILE_SITE_KEY ?? '';
}
