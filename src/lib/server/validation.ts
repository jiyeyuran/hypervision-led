import { z } from 'zod';

export const inquirySchema = z.object({
  language: z.enum(['en', 'zh']).default('en'),
  company: z.string().min(2).max(120),
  name: z.string().min(2).max(80),
  email: z.email().max(120),
  phone: z.string().max(40).optional().or(z.literal('')),
  country: z.string().min(2).max(60),
  productInterest: z.string().max(120).optional().or(z.literal('')),
  message: z.string().min(2).max(4000),
  budget: z.string().max(80).optional().or(z.literal('')),
  quantity: z.coerce.number().int().min(1).max(1_000_000).optional(),
  sourcePage: z.string().max(300).optional().or(z.literal('')),
  website: z.string().max(10).optional(), // honeypot
  renderedAt: z.coerce.number().int(),
  turnstileToken: z.string().optional().or(z.literal('')),
});

export const inquiryFilterSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed', 'spam']).optional(),
  keyword: z.string().max(120).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed', 'spam']),
  reason: z.string().max(500).optional().or(z.literal('')),
});

export const noteCreateSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const blogUpsertSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, 'Slug must be kebab-case ASCII.'),
  title_en: z.string().min(1).max(200),
  title_zh: z.string().min(1).max(200),
  excerpt_en: z.string().min(1).max(500),
  excerpt_zh: z.string().min(1).max(500),
  content_en: z.string().min(1).max(100_000),
  content_zh: z.string().min(1).max(100_000),
  cover_image: z.string().max(1000).nullable().optional(),
  is_published: z.coerce.boolean().default(true),
  published_at: z.string().max(40).nullable().optional(),
});

export type BlogUpsertPayload = z.infer<typeof blogUpsertSchema>;
