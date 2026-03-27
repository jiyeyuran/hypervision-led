import { requireAdmin } from '../../../../src/lib/server/access';
import { getInquiryDetails } from '../../../../src/lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../src/lib/server/response';

export const onRequestGet = async (context: any) => {
  const user = await requireAdmin(context.request, context.env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const id = String(context.params.id ?? '');
  if (!id) {
    return jsonError('Inquiry id is required', 400);
  }
  const data = await getInquiryDetails(context.env, id);
  if (!data) {
    return jsonError('Inquiry not found', 404);
  }
  return jsonOk({ success: true, data });
};
