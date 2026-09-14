import zh from './zh.json';
import en from './en.json';
import th from './th.json';
import zhExtra from './extra/zh.json';
import enExtra from './extra/en.json';
import thExtra from './extra/th.json';

export const defaultLang = 'th';
export const languagesList = ['th', 'zh', 'en'] as const;

export const languages: Record<string, string> = {
  zh: '中文',
  en: 'English',
  th: 'ภาษาไทย',
};

// 新增板块文案集中在 extra/*.json，与原始文案合并（对象递归合并，数组整体替换），
// 因此新增内容不需要改动既有文案文件，也不会覆盖已有字段。
function deepMerge<T extends Record<string, any>>(base: T, extra: Record<string, any>): T {
  const out: Record<string, any> = { ...base };
  for (const [key, value] of Object.entries(extra)) {
    const current = out[key];
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current &&
      typeof current === 'object' &&
      !Array.isArray(current)
    ) {
      out[key] = deepMerge(current, value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

const ui: Record<string, any> = {
  zh: deepMerge(zh, zhExtra),
  en: deepMerge(en, enExtra),
  th: deepMerge(th, thExtra),
};

export function getLangFromUrl(url: URL): string {
  const seg = url.pathname.split('/').filter(Boolean);
  const lang = seg[0];
  return (languagesList as readonly string[]).includes(lang) ? lang : defaultLang;
}

export function getI18n(url: URL) {
  const lang = getLangFromUrl(url);
  const messages = ui[lang];
  const t = (key: string): string => {
    const found = key
      .split('.')
      .reduce<any>((o, i) => (o == null ? undefined : o[i]), messages);
    return found ?? '';
  };
  return { lang, messages, t };
}

export const SITE_ORIGIN = 'https://sanamluangbangkok.com';

/** x-default（未匹配到任何语言时的兜底版本）使用英文版 */
export const xDefaultLang = 'en';

/**
 * 生成带尾斜线的规范 URL。
 * 全站统一「带斜线」形式（与 astro.config.mjs 的 trailingSlash: 'always' 一致），
 * 避免 /en 与 /en/ 被搜索引擎当作两个不同页面而拆分权重。
 */
export function canonicalUrl(lang: string, path = ''): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${SITE_ORIGIN}/${lang}/${clean ? `${clean}/` : ''}`;
}

export function buildAlternates(path = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of languagesList) out[lang] = canonicalUrl(lang, path);
  out.xDefault = canonicalUrl(xDefaultLang, path);
  return out;
}

export function buildHreflangAlternates(path = ''): Record<string, string> {
  return {
    th: canonicalUrl('th', path),
    // 中文站点共用一份简体页面，简繁两种写法都指向同一 URL，
    // 兼顾「皇家田广场」与「皇家田廣場」两类查询。
    'zh-Hans': canonicalUrl('zh', path),
    'zh-Hant': canonicalUrl('zh', path),
    en: canonicalUrl('en', path),
    'x-default': canonicalUrl(xDefaultLang, path),
  };
}

export function htmlLangAttr(lang: string): string {
  if (lang === 'zh') return 'zh-CN';
  if (lang === 'th') return 'th-TH';
  return lang;
}
