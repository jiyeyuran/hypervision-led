export type AppEnv = Pick<
  Cloudflare.Env,
  | 'DB'
  | 'CONFIG_KV'
  | 'RATE_LIMIT_KV'
  | 'ASSETS_R2'
  | 'INQUIRY_QUEUE'
  | 'CF_ACCESS_AUD'
  | 'ADMIN_ALLOWLIST'
  | 'CRM_WEBHOOK_URL'
  | 'CRM_WEBHOOK_TOKEN'
  | 'MAIL_WEBHOOK_URL'
  | 'TURNSTILE_SITE_KEY'
  | 'TURNSTILE_SECRET_KEY'
>;

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'spam';
