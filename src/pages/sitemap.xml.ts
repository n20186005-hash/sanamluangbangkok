import type { APIRoute } from 'astro';
import { buildHreflangAlternates, canonicalUrl, languagesList } from '../i18n/ui';
import { routeDestinationSlugs } from '../lib/routeDestinations';

// 语言首页 + 三个二级专题页参与搜索收录：
// 隐私政策 / 服务条款 / Cookie 设置页已设置 noindex，不进 sitemap。
const INDEXABLE_PATHS = [
  '',
  'how-to-get-to-sanam-luang',
  'sanam-luang-history',
  'sanam-luang-nearby-attractions',
  'guide',
  ...routeDestinationSlugs.map(slug => `guide/${slug}`),
];

export const prerender = true;

export const GET: APIRoute = () => {
  const entries: string[] = [];

  for (const path of INDEXABLE_PATHS) {
    const alts = buildHreflangAlternates(path);
    const alternateLinks = Object.entries(alts)
      .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`)
      .join('\n');

    for (const lang of languagesList) {
      entries.push(
        [
          '  <url>',
          `    <loc>${canonicalUrl(lang, path)}</loc>`,
          alternateLinks,
          '  </url>',
        ].join('\n'),
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
