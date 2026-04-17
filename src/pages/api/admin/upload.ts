import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../lib/server/worker-env';
import { requireAdmin } from '../../../lib/server/access';
import { jsonError, jsonOk } from '../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../lib/server/cors';
import { uploadPublicImage } from '../../../lib/server/uploads';

export const POST: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonError('Expected multipart/form-data', 415);
  }
  const form = await request.formData();
  const file = form.get('file');
  const folder = typeof form.get('folder') === 'string' ? String(form.get('folder')) : 'blog';
  if (!(file instanceof File)) {
    return jsonError('Missing "file" field', 400);
  }
  const origin = new URL(request.url).origin;
  const result = await uploadPublicImage(env, file, folder, origin);
  if ('error' in result) {
    return jsonError(result.error, 400);
  }
  return jsonOk({ success: true, data: result });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
