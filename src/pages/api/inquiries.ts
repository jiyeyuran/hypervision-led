import type { APIRoute } from 'astro';
import { getWorkerEnv } from '../../lib/server/worker-env';
import { getClientIp } from '../../lib/server/env';
import { jsonError, jsonOk } from '../../lib/server/response';
import { createInquiry, addAttachment, newInquiryId } from '../../lib/server/inquiries';
import {
  rateLimit,
  validateFormRenderTime,
  validateHoneypot,
  validateUploadFile,
  verifyTurnstileToken,
} from '../../lib/server/security';
import { inquirySchema } from '../../lib/server/validation';
import { apiHandler, corsPreflightResponse } from '../../lib/server/cors';

async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((item) => item.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = apiHandler(async ({ request }) => {
  const env = getWorkerEnv();
  const ip = getClientIp(request);
  const rate = await rateLimit(env, 'inquiry-submit', ip, 8, 60);
  if (!rate.allowed) {
    return jsonError('Too many requests. Please retry later.', 429);
  }

  const form = await request.formData();
  const str = (key: string) => form.get(key) ?? undefined;
  const payload = inquirySchema.safeParse({
    language: str('language'),
    company: str('company'),
    name: str('name'),
    email: str('email'),
    phone: str('phone'),
    country: str('country'),
    productInterest: str('productInterest'),
    message: str('message'),
    budget: str('budget'),
    quantity: str('quantity'),
    sourcePage: str('sourcePage') ?? new URL(request.url).pathname,
    website: str('website'),
    renderedAt: str('renderedAt'),
    turnstileToken: str('turnstileToken'),
  });
  if (!payload.success) {
    return jsonError('Invalid inquiry payload.', 422, payload.error.flatten());
  }
  const data = payload.data;

  if (!validateHoneypot(data.website)) {
    return jsonOk({ success: true, accepted: true });
  }
  if (!validateFormRenderTime(data.renderedAt)) {
    return jsonError('Form submitted too quickly.', 422);
  }

  const turnstileValid = await verifyTurnstileToken(env, data.turnstileToken ?? null, ip);
  if (!turnstileValid) {
    return jsonError('Turnstile verification failed.', 403);
  }

  const inquiryId = newInquiryId();
  await createInquiry(
    env,
    {
      id: inquiryId,
      language: data.language,
      company: data.company.trim(),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || null,
      country: data.country.trim(),
      product_interest: data.productInterest?.trim() || null,
      message: data.message.trim(),
      budget: data.budget?.trim() || null,
      quantity: data.quantity ?? null,
      source_page: data.sourcePage?.trim() || null,
    },
    await sha256(ip),
  );

  const attachment = form.get('attachment');
  if (attachment && typeof attachment !== 'string' && attachment.size > 0) {
    const check = validateUploadFile(attachment);
    if (!check.ok) {
      return jsonError(check.message ?? 'Invalid file.', 422);
    }
    const objectKey = `inquiries/${inquiryId}/${Date.now()}-${attachment.name}`;
    await env.ASSETS_R2.put(objectKey, await attachment.arrayBuffer(), {
      httpMetadata: { contentType: attachment.type },
    });
    await addAttachment(
      env,
      inquiryId,
      attachment.name,
      objectKey,
      attachment.size,
      attachment.type || 'application/octet-stream',
    );
  }

  await env.INQUIRY_QUEUE.send({
    type: 'inquiry.created',
    inquiryId,
    language: data.language,
    email: data.email,
    company: data.company,
  });

  return jsonOk({ success: true, inquiryId }, 201);
});

export const OPTIONS: APIRoute = async () => corsPreflightResponse();
