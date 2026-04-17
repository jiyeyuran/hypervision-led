import { execute, queryAll, queryFirst } from './db';
import type { AppEnv, InquiryStatus } from './types';

export interface InquiryRow {
  id: string;
  language: 'en' | 'zh';
  company: string;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  product_interest: string | null;
  message: string;
  budget: string | null;
  quantity: number | null;
  source_page: string | null;
  status: InquiryStatus;
  created_at: string;
}

export function newInquiryId() {
  return `in_${crypto.randomUUID().replaceAll('-', '').slice(0, 20)}`;
}

export async function createInquiry(
  env: AppEnv,
  payload: Omit<InquiryRow, 'status' | 'created_at'>,
  ipHash: string,
) {
  await execute(
    env,
    `INSERT INTO inquiries (
      id, language, company, name, email, phone, country, product_interest, message,
      budget, quantity, source_page, status, ip_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
    [
      payload.id,
      payload.language,
      payload.company,
      payload.name,
      payload.email,
      payload.phone,
      payload.country,
      payload.product_interest,
      payload.message,
      payload.budget,
      payload.quantity,
      payload.source_page,
      ipHash,
    ],
  );
}

export async function addAttachment(
  env: AppEnv,
  inquiryId: string,
  fileName: string,
  objectKey: string,
  fileSize: number,
  contentType: string,
) {
  await execute(
    env,
    `INSERT INTO inquiry_attachments (
      id, inquiry_id, file_name, object_key, file_size, content_type
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [crypto.randomUUID(), inquiryId, fileName, objectKey, fileSize, contentType],
  );
}

export async function listInquiries(
  env: AppEnv,
  options: {
    status?: string;
    keyword?: string;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    pageSize: number;
  },
) {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (options.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }
  if (options.keyword) {
    conditions.push('(company LIKE ? OR name LIKE ? OR email LIKE ? OR message LIKE ?)');
    const keyword = `%${options.keyword}%`;
    params.push(keyword, keyword, keyword, keyword);
  }
  if (options.dateFrom) {
    conditions.push('date(created_at) >= date(?)');
    params.push(options.dateFrom);
  }
  if (options.dateTo) {
    conditions.push('date(created_at) <= date(?)');
    params.push(options.dateTo);
  }
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const total = await queryFirst<{ count: number }>(
    env,
    `SELECT COUNT(*) as count FROM inquiries ${where}`,
    params,
  );
  const offset = (options.page - 1) * options.pageSize;
  const rows = await queryAll<InquiryRow>(
    env,
    `SELECT *
     FROM inquiries
     ${where}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, options.pageSize, offset],
  );
  return {
    rows,
    total: total?.count ?? 0,
    page: options.page,
    pageSize: options.pageSize,
  };
}

export async function getInquiryDetails(env: AppEnv, id: string) {
  const inquiry = await queryFirst<InquiryRow>(
    env,
    `SELECT * FROM inquiries WHERE id = ? LIMIT 1`,
    [id],
  );
  if (!inquiry) {
    return null;
  }
  const attachments = await queryAll(
    env,
    `SELECT id, file_name, object_key, file_size, content_type, created_at
     FROM inquiry_attachments
     WHERE inquiry_id = ?
     ORDER BY created_at DESC`,
    [id],
  );
  const notes = await queryAll(
    env,
    `SELECT id, content, created_by, created_at
     FROM inquiry_notes
     WHERE inquiry_id = ?
     ORDER BY created_at DESC`,
    [id],
  );
  const statusLogs = await queryAll(
    env,
    `SELECT id, old_status, new_status, reason, changed_by, created_at
     FROM inquiry_status_logs
     WHERE inquiry_id = ?
     ORDER BY created_at DESC`,
    [id],
  );
  return { inquiry, attachments, notes, statusLogs };
}

export async function changeInquiryStatus(
  env: AppEnv,
  id: string,
  status: InquiryStatus,
  operatorEmail: string,
  reason?: string,
) {
  const current = await queryFirst<{ status: InquiryStatus }>(
    env,
    `SELECT status FROM inquiries WHERE id = ? LIMIT 1`,
    [id],
  );
  if (!current) {
    return false;
  }
  if (current.status === status) {
    return true;
  }

  await execute(
    env,
    `UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [status, id],
  );
  await execute(
    env,
    `INSERT INTO inquiry_status_logs (
      id, inquiry_id, old_status, new_status, reason, changed_by
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [crypto.randomUUID(), id, current.status, status, reason ?? null, operatorEmail],
  );
  return true;
}

export async function addInquiryNote(
  env: AppEnv,
  id: string,
  content: string,
  operatorEmail: string,
) {
  await execute(
    env,
    `INSERT INTO inquiry_notes (id, inquiry_id, content, created_by)
     VALUES (?, ?, ?, ?)`,
    [crypto.randomUUID(), id, content, operatorEmail],
  );
}
