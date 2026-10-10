/**
 * 二级专题页配置。
 * - 三个专题：交通 / 历史 / 周边景点（slug 与 SEO 报告一致）。
 * - 内容分别在 src/i18n/extra/{en,zh,th}.json 的 `topics` 命名空间下，
 *   键名见 TOPIC_KEY_BY_SLUG。
 * - 路由、sitemap、TopicLinks 与 TopicPage 复用此处的常量。
 */
export const TOPIC_SLUGS = [
  'how-to-get-to-sanam-luang',
  'sanam-luang-history',
  'sanam-luang-nearby-attractions',
] as const;

export type TopicSlug = (typeof TOPIC_SLUGS)[number];

export const TOPIC_KEY_BY_SLUG: Record<string, string> = {
  'how-to-get-to-sanam-luang': 'howToGetThere',
  'sanam-luang-history': 'history',
  'sanam-luang-nearby-attractions': 'nearbyAttractions',
};
