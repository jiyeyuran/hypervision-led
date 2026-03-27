import type { MessageBatch, Message, ExecutionContext } from '@cloudflare/workers-types';

interface QueueEnv {
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_TOKEN?: string;
  MAIL_WEBHOOK_URL?: string;
}

interface InquiryCreatedMessage {
  type: 'inquiry.created';
  inquiryId: string;
  language: 'en' | 'zh';
  email: string;
  company: string;
}

async function postJson(url: string, payload: unknown, token?: string) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }
}

async function handleMessage(msg: Message<InquiryCreatedMessage>, env: QueueEnv) {
  const payload = msg.body;
  if (payload.type !== 'inquiry.created') {
    msg.ack();
    return;
  }

  if (env.MAIL_WEBHOOK_URL) {
    await postJson(env.MAIL_WEBHOOK_URL, {
      template: 'new_inquiry',
      inquiryId: payload.inquiryId,
      to: 'sales@hypervision-led.com',
      language: payload.language,
      variables: payload,
    });
  }

  if (env.CRM_WEBHOOK_URL) {
    await postJson(
      env.CRM_WEBHOOK_URL,
      {
        event: 'lead.created',
        id: payload.inquiryId,
        email: payload.email,
        company: payload.company,
        source: 'website',
      },
      env.CRM_WEBHOOK_TOKEN,
    );
  }

  msg.ack();
}

export default {
  async queue(batch: MessageBatch<InquiryCreatedMessage>, env: QueueEnv, _ctx: ExecutionContext) {
    for (const msg of batch.messages) {
      try {
        await handleMessage(msg, env);
      } catch (error) {
        console.error('queue-consumer-error', error);
        msg.retry();
      }
    }
  },
};
