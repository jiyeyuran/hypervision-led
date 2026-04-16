import * as cloudflareWorkers from 'cloudflare:workers';
import type { AppEnv } from './types';

/** Astro v6+: bindings from `cloudflare:workers` (replaces Astro.locals.runtime.env). */
export function getWorkerEnv(): AppEnv {
  return cloudflareWorkers.env as AppEnv;
}
