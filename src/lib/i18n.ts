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
      trustBadge: 'Trusted by 1,200+ projects in 60+ countries',
      stats: [
        { value: '12+', label: 'Years in LED Manufacturing' },
        { value: '60+', label: 'Countries Delivered' },
        { value: '1,200+', label: 'Projects Completed' },
        { value: '12,000', label: 'sqm Monthly Output' },
      ],
      solutionsTitle: 'Industry Solutions',
      solutionsDesc: 'Tailored LED display solutions serving a wide range of B2B scenarios.',
      solutions: [
        {
          title: 'Retail & Shopping Mall',
          desc: 'High-brightness fine-pitch displays that turn dead zones into premium digital booths.',
        },
        {
          title: 'Rental & Events',
          desc: 'Die-cast aluminum cabinets with fast-lock design for concerts, trade shows and roadshows.',
        },
        {
          title: 'Control Room & Command',
          desc: 'Seamless splicing, high refresh rate and 24/7 stability for mission critical monitoring.',
        },
        {
          title: 'Outdoor Advertising',
          desc: 'IP65 energy-saving cabinets built for billboards, stadiums and transport hubs.',
        },
        {
          title: 'Transparent LED',
          desc: 'See-through panels keeping storefronts bright while running eye-catching creatives.',
        },
        {
          title: 'Smart City & Transport',
          desc: 'Information displays for subways, airports, highways and city landmarks.',
        },
      ],
      whyTitle: 'Why Choose HyperVision',
      whyDesc:
        'Our products have gained excellent reputation among new and old customers worldwide.',
      why: [
        {
          title: 'Experience',
          desc: '12 years manufacturing expertise, thousands of engineers, designers and production workers.',
        },
        {
          title: 'Warranty',
          desc: '2-3 years high-quality warranty with responsive local service partners.',
        },
        {
          title: 'Certificates',
          desc: 'CE EMC, RoHS, FCC, UL certified to meet global market standards.',
        },
        {
          title: 'Quality',
          desc: 'Direct factory pricing with strict QC: aging test, load burn-in and color calibration.',
        },
        {
          title: 'Service',
          desc: '24/7 online support with dedicated sales engineers reply in 12 hours.',
        },
        {
          title: 'Delivery',
          desc: 'Fast worldwide delivery with safe payment terms and door-to-door logistics.',
        },
      ],
      processTitle: 'From Inquiry to Installation',
      processDesc: 'A transparent, structured B2B process that gives overseas buyers confidence.',
      process: [
        {
          step: '01',
          title: 'Inquiry',
          desc: 'Share project size, pixel pitch and installation environment.',
        },
        {
          step: '02',
          title: 'Proposal',
          desc: 'We return pricing, drawings and solution within 12 hours.',
        },
        {
          step: '03',
          title: 'Production',
          desc: 'SMT, aging test and 72-hour load burn-in before packing.',
        },
        {
          step: '04',
          title: 'Installation',
          desc: 'On-site guidance, commissioning and long-term maintenance.',
        },
      ],
      testimonialsTitle: 'What Global Partners Say',
      testimonials: [
        {
          quote:
            'The outdoor P4 cabinets have been running flawlessly at our stadium for two seasons. Their engineering team is fast and reliable.',
          author: 'Project Director',
          company: 'Sports Arena, Spain',
        },
        {
          quote:
            'We rolled out 40 retail stores with HyperVision fine-pitch displays. On-time delivery and consistent brightness across batches.',
          author: 'Head of Retail Tech',
          company: 'Luxury Brand, UAE',
        },
        {
          quote:
            'Great partner for rental business. Fast lock cabinets, low weight and stable power system saved a lot of labor cost.',
          author: 'Rental Company Owner',
          company: 'Event Supplier, Germany',
        },
      ],
      newsTitle: 'News & Insights',
      newsDesc: 'Updates on LED display technology, projects and industry trends.',
      news: [
        {
          date: 'March 26, 2026',
          title: 'How Creative LED Screens Capture Attention in 3 Seconds',
          excerpt:
            'In today’s competitive retail landscape, a pop-up store is a high-impact marketing moment where first impressions determine success.',
        },
        {
          date: 'February 12, 2026',
          title: 'Exhibition Attention Magnets: Standing Out with LED Screens',
          excerpt:
            'Trade show floors are crowded environments. Your brand has only a few seconds to make an impression. LED walls turn curiosity into conversation.',
        },
        {
          date: 'January 07, 2026',
          title: 'Transforming Mall Dead Zones into Premium Digital Booths',
          excerpt:
            'Columns, narrow lobbies and quiet corridors used to be wasted space. Indoor LED displays are rewriting their commercial value.',
        },
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [
        {
          q: 'What is the typical lead time?',
          a: 'Standard models ship in 7-15 days. Custom cabinet sizes and color-calibrated batches take 20-30 days.',
        },
        {
          q: 'Do you support OEM / ODM?',
          a: 'Yes. We support logo printing, custom cabinet sizes, custom power systems and full ODM co-development.',
        },
        {
          q: 'What payment terms are accepted?',
          a: 'T/T, L/C and escrow are supported. Typical terms are 30% deposit, 70% before shipment.',
        },
        {
          q: 'How do you ensure quality?',
          a: 'Every batch passes SMT AOI, 72-hour aging test, high-low temperature test and final color calibration.',
        },
      ],
      ctaBannerTitle: 'Ready to start your LED display project?',
      ctaBannerDesc: 'Talk with our engineers. We reply within 12 hours with a detailed quotation.',
      galleryTitle: 'Global Project Gallery',
      galleryDesc: 'Selected installations from our worldwide deployments.',
      scenesTitle: 'Featured Application Scenes',
      scenesDesc:
        'Image-focused references for retail, exhibition, control room and outdoor campaigns.',
      factoryTitle: 'Factory & Process Visibility',
      factoryDesc:
        'Inspired by high-conversion B2B LED sites, we emphasize visual proof: workshop scenes, QC photos, and deployment snapshots to improve trust for overseas buyers.',
      factoryPoints: [
        'Incoming material QC images',
        'Module aging test records',
        'Cabinet assembly and packaging photos',
        'On-site installation reports',
      ],
    },
    about: {
      title: 'About HyperVision',
      description:
        'HyperVision is a B2B LED display manufacturer focused on quality, fast delivery, and long-term technical support.',
      story:
        'Since our establishment, we have been developing world-class LED products. Our factory covers 60,000+ sqm in Shenzhen Bao’an, with 8 automated SMT lines and a dedicated QC lab. We serve partners in retail, rental, sports, transport and smart city industries.',
      capabilityTitle: 'Factory & Capacity',
      capabilityDesc: '8 automated lines, SMT process control, and monthly output over 12,000 sqm.',
      engineeringTitle: 'Engineering Support',
      engineeringDesc:
        'CAD drawing, thermal simulation, installation guide, and after-sales maintenance support.',
      certTitle: 'Certificates & Project Photos',
    },
    contact: {
      title: 'Contact Us',
      description: 'Talk with our sales engineers. We usually reply within 12 hours.',
    },
    inquiry: {
      title: 'Send an Inquiry',
      description: 'Please provide your project details for an accurate quotation.',
    },
    footer: {
      tagline:
        'HyperVision is a global LED display manufacturer specializing in R&D, production and sales of indoor, outdoor, rental and fine-pitch displays.',
      quickLinks: 'Quick Links',
      categories: 'Product Category',
      contactUs: 'Contact Us',
      address: 'Bao’an District, Shenzhen, China',
      email: 'sales@hypervision-led.com',
      phone: '+86-755-0000-0000',
      copyright: 'All rights reserved.',
      categoryItems: [
        'Commercial LED Screen',
        'Rental LED Screen',
        'Fine Pixel LED Screen',
        'Transparent LED Screen',
        'Energy Saving LED Display',
        'Sports LED Display',
      ],
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
      heroDescription: '我们为零售、活动、交通和智慧城市项目提供稳定可靠的 LED 显示系统。',
      ctaPrimary: '获取报价',
      ctaSecondary: '查看产品',
      trustBadge: '已为 60+ 国家的 1,200+ 项目交付',
      stats: [
        { value: '12+', label: '行业经验（年）' },
        { value: '60+', label: '服务国家' },
        { value: '1,200+', label: '交付项目' },
        { value: '12,000', label: '月产能（平方米）' },
      ],
      solutionsTitle: '行业解决方案',
      solutionsDesc: '针对不同 B2B 场景提供量身定制的 LED 显示方案。',
      solutions: [
        { title: '零售与商业综合体', desc: '高亮小间距屏幕，将商场“死角”改造为高价值数字展位。' },
        { title: '租赁与活动', desc: '压铸铝箱体 + 快锁结构，适配演唱会、展会与路演。' },
        { title: '指挥中心与监控', desc: '无缝拼接、高刷新率，7×24 稳定运行于关键监控场景。' },
        { title: '户外广告', desc: 'IP65 节能箱体，适用于户外大牌、体育场馆与交通枢纽。' },
        { title: '透明 LED', desc: '保留门店通透性的同时，呈现抢眼的创意画面。' },
        { title: '智慧城市与交通', desc: '地铁、机场、高速与城市地标的信息显示与引导。' },
      ],
      whyTitle: '为什么选择 HyperVision',
      whyDesc: '我们的产品在新老客户中广受赞誉，值得全球合作伙伴信赖。',
      why: [
        {
          title: '经验',
          desc: '12 年 LED 显示屏研发制造经验，工程师、设计师和产线工人组成专业团队。',
        },
        { title: '质保', desc: '2-3 年高品质质保，全球合作伙伴提供本地化响应服务。' },
        { title: '资质', desc: '通过 CE EMC、RoHS、FCC、UL 等国际认证，满足全球市场准入。' },
        { title: '品质', desc: '工厂直供价格，严格 QC：老化测试、带载烤机与色彩校准。' },
        { title: '服务', desc: '7×24 在线支持，销售工程师 12 小时内回复。' },
        { title: '交付', desc: '全球快速交付，安全的支付方式与门到门物流。' },
      ],
      processTitle: '从询盘到安装',
      processDesc: '透明、结构化的 B2B 流程，让海外买家放心。',
      process: [
        { step: '01', title: '询盘', desc: '告诉我们项目尺寸、点间距、安装环境等需求。' },
        { step: '02', title: '方案', desc: '12 小时内返回报价、图纸与完整方案。' },
        { step: '03', title: '生产', desc: 'SMT 贴装、老化测试、72 小时带载烤机后打包发货。' },
        { step: '04', title: '安装', desc: '现场指导、调试与长期维护支持。' },
      ],
      testimonialsTitle: '全球合作伙伴评价',
      testimonials: [
        {
          quote: '户外 P4 箱体已在我们的体育场稳定运行两个赛季，他们的工程团队响应快速、可靠。',
          author: '项目总监',
          company: '西班牙体育场',
        },
        {
          quote:
            '我们用 HyperVision 的小间距屏幕同时上线了 40 家零售门店，按期交付且批次间亮度一致。',
          author: '零售技术负责人',
          company: '阿联酋奢侈品品牌',
        },
        {
          quote: '做租赁业务的绝佳伙伴：快锁箱体、轻量化、稳定的供电系统，大幅节省了人工成本。',
          author: '租赁公司老板',
          company: '德国活动供应商',
        },
      ],
      newsTitle: '新闻与洞察',
      newsDesc: '关于 LED 显示技术、项目与行业趋势的最新内容。',
      news: [
        {
          date: '2026-03-26',
          title: '创意 LED 屏如何在 3 秒内抓住注意力',
          excerpt: '在竞争激烈的零售环境中，快闪店是第一印象决定成败的高影响力营销节点。',
        },
        {
          date: '2026-02-12',
          title: '展会注意力磁铁：用 LED 屏脱颖而出',
          excerpt:
            '展会现场人流拥挤，你的品牌只有几秒钟时间留下印象，LED 屏能把好奇心转化为深度对话。',
        },
        {
          date: '2026-01-07',
          title: '把商场“死角”改造成高溢价数字展位',
          excerpt: '立柱、狭窄门厅和过道曾是被浪费的空间，室内 LED 屏正在重写它们的商业价值。',
        },
      ],
      faqTitle: '常见问题',
      faq: [
        { q: '标准交期是多久？', a: '标准型号 7-15 天发货，定制尺寸与色彩校准批次 20-30 天。' },
        {
          q: '是否支持 OEM / ODM？',
          a: '支持 logo 印刷、定制箱体尺寸、定制电源系统以及完整 ODM 联合研发。',
        },
        {
          q: '支持哪些付款方式？',
          a: '支持 T/T、L/C 与担保交易，常规为 30% 定金、70% 发货前付清。',
        },
        { q: '如何保证品质？', a: '每批次都经过 SMT AOI、72 小时老化、高低温测试与色彩校准。' },
      ],
      ctaBannerTitle: '准备启动您的 LED 显示项目？',
      ctaBannerDesc: '联系我们的工程师，12 小时内获得详细报价。',
      galleryTitle: '全球项目图集',
      galleryDesc: '精选来自全球的交付案例。',
      scenesTitle: '精选应用场景',
      scenesDesc: '强化图片展示：商业、展览、控制室、户外广告等应用场景。',
      factoryTitle: '工厂可视化实力',
      factoryDesc:
        '参考头部外贸网站，我们增加了更高密度的实拍图：产线、老化测试、交付案例，提升海外客户信任度。',
      factoryPoints: ['来料 QC 实拍', '模组老化测试记录', '箱体组装与包装实拍', '现场安装报告'],
    },
    about: {
      title: '关于 HyperVision',
      description: 'HyperVision 是专注品质、交付与长期技术支持的 B2B LED 显示制造商。',
      story:
        '自成立以来，我们始终致力于打造世界级 LED 产品。工厂位于深圳宝安，占地 60,000+ 平方米，拥有 8 条自动化 SMT 产线与独立 QC 实验室，服务零售、租赁、体育、交通与智慧城市等多个行业。',
      capabilityTitle: '工厂与产能',
      capabilityDesc: '8 条自动化产线，严格 SMT 过程控制，月产能 12,000+ 平方米。',
      engineeringTitle: '工程支持',
      engineeringDesc: '提供 CAD 图纸、热仿真、安装指南与售后维护支持。',
      certTitle: '资质与项目实拍',
    },
    contact: {
      title: '联系我们',
      description: '与销售工程师沟通，我们通常在 12 小时内回复。',
    },
    inquiry: {
      title: '提交询盘',
      description: '请提供项目细节，方便我们给出准确报价。',
    },
    footer: {
      tagline:
        'HyperVision 是专注 LED 显示屏研发、生产与销售的全球供应商，覆盖室内、户外、租赁与小间距等全系列产品。',
      quickLinks: '快速导航',
      categories: '产品分类',
      contactUs: '联系我们',
      address: '中国·深圳市宝安区',
      email: 'sales@hypervision-led.com',
      phone: '+86-755-0000-0000',
      copyright: '版权所有。',
      categoryItems: [
        '商业 LED 屏',
        '租赁 LED 屏',
        '小间距 LED 屏',
        '透明 LED 屏',
        '节能 LED 显示',
        '体育 LED 显示',
      ],
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
