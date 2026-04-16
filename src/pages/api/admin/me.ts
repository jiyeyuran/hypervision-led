import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../lib/server/worker-env';
import { requireAdmin } from '../../../lib/server/access';
import { jsonError, jsonOk } from '../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../lib/server/cors';

export const GET: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  return jsonOk({ success: true, data: user });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
