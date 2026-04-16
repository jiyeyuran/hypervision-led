import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../../lib/server/access';
import { getInquiryDetails } from '../../../../../lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../../../lib/server/cors';

export const GET: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(params.id ?? '');
  if (!id) {
    return jsonError('Inquiry id is required', 400);
  }
  const data = await getInquiryDetails(env, id);
  if (!data) {
    return jsonError('Inquiry not found', 404);
  }
  return jsonOk({ success: true, data });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
