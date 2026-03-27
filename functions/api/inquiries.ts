import { getClientIp } from '../../src/lib/server/env';
import { jsonError, jsonOk } from '../../src/lib/server/response';
import { createInquiry, addAttachment, newInquiryId } from '../../src/lib/server/inquiries';
import {
  rateLimit,
  validateFormRenderTime,
  validateHoneypot,
  validateUploadFile,
  verifyTurnstileToken,
} from '../../src/lib/server/security';
import { inquirySchema } from '../../src/lib/server/validation';

async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((item) => item.toString(16).padStart(2, '0')).join('');
}

export const onRequestPost = async (context: any) => {
  const env = context.env;
  const ip = getClientIp(context.request);
  const rate = await rateLimit(env, 'inquiry-submit', ip, 8, 60);
  if (!rate.allowed) {
    return jsonError('Too many requests. Please retry later.', 429);
  }

  const form = await context.request.formData();
  const payload = inquirySchema.safeParse({
    language: form.get('language'),
    company: form.get('company'),
    name: form.get('name'),
    email: form.get('email'),
    phone: form.get('phone'),
    country: form.get('country'),
    productInterest: form.get('productInterest'),
    message: form.get('message'),
    budget: form.get('budget'),
    quantity: form.get('quantity'),
    sourcePage: form.get('sourcePage') ?? new URL(context.request.url).pathname,
    website: form.get('website'),
    renderedAt: form.get('renderedAt'),
    turnstileToken: form.get('turnstileToken'),
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
      httpMetadata: {
        contentType: attachment.type,
      },
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
};
