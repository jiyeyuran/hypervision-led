import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../lib/server/access';
import { createBlog, listAdminBlogs } from '../../../../lib/server/content';
import { jsonError, jsonOk } from '../../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../../lib/server/cors';
import { blogUpsertSchema } from '../../../../lib/server/validation';

export const GET: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const rows = await listAdminBlogs(env);
  return jsonOk({ success: true, data: { rows } });
});

export const POST: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const payload = await request.json().catch(() => null);
  const parsed = blogUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError('Invalid blog payload', 422, parsed.error.flatten());
  }
  try {
    const created = await createBlog(env, parsed.data);
    return jsonOk({ success: true, data: created }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create blog';
    if (message.includes('UNIQUE')) {
      return jsonError('Slug already exists', 409);
    }
    return jsonError(message, 500);
  }
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
