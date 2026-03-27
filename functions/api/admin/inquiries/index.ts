import { requireAdmin } from '../../../../src/lib/server/access';
import { listInquiries } from '../../../../src/lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../src/lib/server/response';
import { inquiryFilterSchema } from '../../../../src/lib/server/validation';

export const onRequestGet = async (context: any) => {
  const user = await requireAdmin(context.request, context.env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const url = new URL(context.request.url);
  const parsed = inquiryFilterSchema.safeParse({
    status: url.searchParams.get('status') ?? undefined,
    keyword: url.searchParams.get('keyword') ?? undefined,
    dateFrom: url.searchParams.get('dateFrom') ?? undefined,
    dateTo: url.searchParams.get('dateTo') ?? undefined,
    page: url.searchParams.get('page') ?? undefined,
    pageSize: url.searchParams.get('pageSize') ?? undefined,
  });
  if (!parsed.success) {
    return jsonError('Invalid query parameters', 422, parsed.error.flatten());
  }
  const data = await listInquiries(context.env, parsed.data);
  return jsonOk({ success: true, data });
};
