import { requireAdmin } from '../../../../../src/lib/server/access';
import { changeInquiryStatus } from '../../../../../src/lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../../src/lib/server/response';
import { statusUpdateSchema } from '../../../../../src/lib/server/validation';

export const onRequestPost = async (context: any) => {
  const user = await requireAdmin(context.request, context.env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(context.params.id ?? '');
  if (!id) {
    return jsonError('Inquiry id is required', 400);
  }
  const parsed = statusUpdateSchema.safeParse(await context.request.json());
  if (!parsed.success) {
    return jsonError('Invalid status payload', 422, parsed.error.flatten());
  }
  const ok = await changeInquiryStatus(context.env, id, parsed.data.status, user.email, parsed.data.reason);
  if (!ok) {
    return jsonError('Inquiry not found', 404);
  }
  return jsonOk({ success: true });
};
