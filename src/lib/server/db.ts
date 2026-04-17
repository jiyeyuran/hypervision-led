import type { AppEnv } from './types';

export async function queryAll<T>(env: AppEnv, sql: string, params: unknown[] = []): Promise<T[]> {
  const statement = params.length > 0 ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql);
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
  const statement = params.length > 0 ? env.DB.prepare(sql).bind(...params) : env.DB.prepare(sql);
  return statement.run();
}
