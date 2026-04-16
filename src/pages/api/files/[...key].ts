import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../lib/server/worker-env';
import { requireAdmin } from '../../../lib/server/access';
import { jsonError } from '../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../lib/server/cors';

export const GET: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const key = String(params.key ?? '');
  if (!key) {
    return jsonError('File key is required', 400);
  }
  const object = await env.ASSETS_R2.get(key);
  if (!object) {
    return jsonError('File not found', 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'private, max-age=3600');
  return new Response(object.body, { headers });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
