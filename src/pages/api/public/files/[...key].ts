import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../lib/server/worker-env';
import { jsonError } from '../../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../../lib/server/cors';

export const GET: APIRoute = apiHandler(async ({ params }) => {
  const env = getWorkerEnv();
  const key = String(params.key ?? '');
  if (!key) {
    return jsonError('File key is required', 400);
  }
  if (!key.startsWith('public/')) {
    return jsonError('File is not public', 403);
  }
  const object = await env.ASSETS_R2.get(key);
  if (!object) {
    return jsonError('File not found', 404);
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(object.body, { headers });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
