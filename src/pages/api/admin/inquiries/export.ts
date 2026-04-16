import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../../../lib/server/worker-env';
import { requireAdmin } from '../../../../lib/server/access';
import { listInquiries } from '../../../../lib/server/inquiries';
import { jsonError } from '../../../../lib/server/response';
import { apiHandler, corsPreflightResponse } from '../../../../lib/server/cors';

function csvEscape(value: unknown): string {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

export const GET: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const user = await requireAdmin(request, env);
  if (!user) {
    return jsonError('Unauthorized', 401);
  }
  const data = await listInquiries(env, {
    page: 1,
    pageSize: 1000,
    status: undefined,
    keyword: undefined,
    dateFrom: undefined,
    dateTo: undefined,
  });
  const header = ['id', 'company', 'name', 'email', 'country', 'status', 'created_at'];
  const rows = data.rows.map((row) =>
    [row.id, row.company, row.name, row.email, row.country, row.status, row.created_at]
      .map(csvEscape)
      .join(','),
  );
  const csv = [header.join(','), ...rows].join('\n');
  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
