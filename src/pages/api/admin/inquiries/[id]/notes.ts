import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../../lib/server/access';
import { addInquiryNote } from '../../../../../lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../../lib/server/response';
import { noteCreateSchema } from '../../../../../lib/server/validation';
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
  const parsed = noteCreateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return jsonError('Invalid note payload', 422, parsed.error.flatten());
  }
  await addInquiryNote(env, id, parsed.data.content, user.email);
  return jsonOk({ success: true }, 201);
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
