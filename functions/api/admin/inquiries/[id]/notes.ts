import { requireAdmin } from '../../../../../src/lib/server/access';
import { addInquiryNote } from '../../../../../src/lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../../src/lib/server/response';
import { noteCreateSchema } from '../../../../../src/lib/server/validation';

export const onRequestPost = async (context: any) => {
  const user = await requireAdmin(context.request, context.env, ['admin', 'editor']);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(context.params.id ?? '');
  if (!id) {
    return jsonError('Inquiry id is required', 400);
  }
  const parsed = noteCreateSchema.safeParse(await context.request.json());
  if (!parsed.success) {
    return jsonError('Invalid note payload', 422, parsed.error.flatten());
  }
  await addInquiryNote(context.env, id, parsed.data.content, user.email);
  return jsonOk({ success: true }, 201);
};
