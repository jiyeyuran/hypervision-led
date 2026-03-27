export type Language = 'en' | 'zh';

export const languages: Language[] = ['en', 'zh'];

export const defaultLanguage: Language = 'en';

export const messages = {
  en: {
    siteName: 'HyperVision LED',
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Products',
      blog: 'Blog',
      contact: 'Contact',
      inquiry: 'Inquiry',
    },
    home: {
      heroTitle: 'Industrial LED Display Solutions for Global Brands',
      heroDescription:
        'We design and manufacture reliable LED display systems for retail, events, transportation, and smart city projects.',
      ctaPrimary: 'Request Quote',
      ctaSecondary: 'View Products',
    },
    about: {
      title: 'About HyperVision',
      description:
        'HyperVision is a B2B LED display manufacturer focused on quality, fast delivery, and long-term technical support.',
    },
    contact: {
      title: 'Contact Us',
      description: 'Talk with our sales engineers. We usually reply within 12 hours.',
    },
    inquiry: {
      title: 'Send an Inquiry',
      description: 'Please provide your project details for an accurate quotation.',
    },
  },
  zh: {
    siteName: 'HyperVision LED',
    nav: {
      home: '首页',
      about: '关于我们',
      products: '产品',
      blog: '博客',
      contact: '联系我们',
      inquiry: '询盘',
    },
    home: {
      heroTitle: '面向全球品牌的工业级 LED 显示方案',
      heroDescription:
        '我们为零售、活动、交通和智慧城市项目提供稳定可靠的 LED 显示系统。',
      ctaPrimary: '获取报价',
      ctaSecondary: '查看产品',
    },
    about: {
      title: '关于 HyperVision',
      description:
        'HyperVision 是专注品质、交付与长期技术支持的 B2B LED 显示制造商。',
    },
    contact: {
      title: '联系我们',
      description: '与销售工程师沟通，我们通常在 12 小时内回复。',
    },
    inquiry: {
      title: '提交询盘',
      description: '请提供项目细节，方便我们给出准确报价。',
    },
  },
} as const;

export function normalizeLanguage(value?: string | null): Language {
  return value === 'zh' ? 'zh' : 'en';
}

export function getLocalizedPath(path: string, language: Language): string {
  if (language === 'en') {
    return path;
  }
  return `/zh${path}`;
}

export function withLanguageSuffix(base: string, language: Language): string {
  if (language === 'en') {
    return `${base}_en`;
  }
  return `${base}_zh`;
}
