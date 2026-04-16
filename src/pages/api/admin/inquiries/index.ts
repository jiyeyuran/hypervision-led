import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../lib/server/access';
import { listInquiries } from '../../../../lib/server/inquiries';
import { jsonError, jsonOk } from '../../../../lib/server/response';
import { inquiryFilterSchema } from '../../../../lib/server/validation';
import { apiHandler, corsPreflightResponse } from '../../../../lib/server/cors';

export const GET: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const url = new URL(request.url);
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
  const data = await listInquiries(env, parsed.data);
  return jsonOk({ success: true, data });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
