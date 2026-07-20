export const siteConfig = {
  name: 'Sanam Luang',
  baseUrl: 'https://sanamluangbangkok.com',
  slug: 'sanam-luang',
  locales: ['zh', 'en', 'th'] as const,
};

export const ogLocale: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  th: 'th_TH',
};
