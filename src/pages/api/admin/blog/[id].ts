import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../lib/server/access';
import { deleteBlog, getAdminBlog, updateBlog } from '../../../../lib/server/content';
import { jsonError, jsonOk } from '../../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../../lib/server/cors';
import { blogUpsertSchema } from '../../../../lib/server/validation';

export const GET: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(params.id ?? '');
  if (!id) {
    return jsonError('Blog id is required', 400);
  }
  const data = await getAdminBlog(env, id);
  if (!data) {
    return jsonError('Blog not found', 404);
  }
  return jsonOk({ success: true, data });
});

export const PUT: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(params.id ?? '');
  if (!id) {
    return jsonError('Blog id is required', 400);
  }
  const payload = await request.json().catch(() => null);
  const parsed = blogUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError('Invalid blog payload', 422, parsed.error.flatten());
  }
  try {
    const updated = await updateBlog(env, id, parsed.data);
    return jsonOk({ success: true, data: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update blog';
    if (message.includes('not found')) {
      return jsonError('Blog not found', 404);
    }
    if (message.includes('UNIQUE')) {
      return jsonError('Slug already exists', 409);
    }
    return jsonError(message, 500);
  }
});

export const DELETE: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env, ['admin']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(params.id ?? '');
  if (!id) {
    return jsonError('Blog id is required', 400);
  }
  const ok = await deleteBlog(env, id);
  if (!ok) {
    return jsonError('Blog not found', 404);
  }
  return jsonOk({ success: true });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
