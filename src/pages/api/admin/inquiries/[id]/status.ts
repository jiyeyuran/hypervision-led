import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../../lib/server/access';
import { changeInquiryStatus } from '../../../../../lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../../lib/server/response';
import { statusUpdateSchema } from '../../../../../lib/server/validation';
import { apiHandler, corsPreflightResponse } from '../../../../../lib/server/cors';

export const POST: APIRoute = apiHandler(async ({ request, params }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(params.id ?? '');
  if (!id) {
    return jsonError('Inquiry id is required', 400);
  }
  const parsed = statusUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid status payload', 422, parsed.error.flatten());
  }
  const ok = await changeInquiryStatus(env, id, parsed.data.status, user.email, parsed.data.reason);
  if (!ok) {
    return jsonError('Inquiry not found', 404);
  }
  return jsonOk({ success: true });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
