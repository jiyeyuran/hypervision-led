import type { D1PreparedStatement } from '@cloudflare/workers-types';
import type { AppEnv } from './types';

export async function queryAll<T>(env: AppEnv, sql: string, params: unknown[] = []): Promise<T[]> {
  let statement: D1PreparedStatement = env.DB.prepare(sql);
  for (const item of params) {
    statement = statement.bind(item);
  }
  const result = await statement.all<T>();
  return result.results ?? [];
}

export async function queryFirst<T>(
  env: AppEnv,
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const list = await queryAll<T>(env, sql, params);
  return list[0] ?? null;
}

export async function execute(env: AppEnv, sql: string, params: unknown[] = []) {
  let statement: D1PreparedStatement = env.DB.prepare(sql);
  for (const item of params) {
    statement = statement.bind(item);
  }
  return statement.run();
}
