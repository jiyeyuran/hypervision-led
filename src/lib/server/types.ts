export interface AppEnv {
  DB: any;
  CONFIG_KV: any;
  RATE_LIMIT_KV: any;
  ASSETS_R2: any;
  INQUIRY_QUEUE: any;
  CF_ACCESS_AUD: string;
  ADMIN_ALLOWLIST: string;
  CRM_WEBHOOK_URL?: string;
  CRM_WEBHOOK_TOKEN?: string;
  MAIL_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
