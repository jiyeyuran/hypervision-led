import type { Language } from './i18n';

export function pickLocalized(row: unknown, key: string, language: Language): string {
  const record = row as Record<string, unknown>;
  const preferred = record[`${key}_${language}`];
  const fallback = record[`${key}_en`];
  return String(preferred ?? fallback ?? '');
}
