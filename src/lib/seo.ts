import type { Language } from './i18n';

const SITE_URL = 'https://www.hypervision-led.com';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  language: Language;
  image?: string;
}

export function getCanonicalUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function getAlternateUrls(path: string): Record<Language, string> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const enPath = normalizedPath.replace(/^\/zh/, '') || '/';
  const zhPath = normalizedPath.startsWith('/zh') ? normalizedPath : `/zh${normalizedPath}`;
  return {
    en: getCanonicalUrl(enPath),
    zh: getCanonicalUrl(zhPath),
  };
}

export function buildOrganizationJsonLd(language: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HyperVision LED',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      language === 'zh'
        ? 'HyperVision 提供工业级 LED 显示方案，服务全球 B2B 客户。'
        : 'HyperVision delivers industrial LED display solutions for global B2B clients.',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'sales@hypervision-led.com',
        availableLanguage: ['English', 'Chinese'],
      },
    ],
  };
}
