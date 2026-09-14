import type { APIRoute } from 'astro';
import { xDefaultLang } from '../i18n/ui';

// 根域名是一个「无语言」的中转 URL，不承载任何正文内容。
// 直接 301 到 x-default（英文版）的规范 URL，避免：
//   1) 根域名与语言首页内容重复、互相竞争；
//   2) 用 meta refresh 做跳转（搜索引擎不视其为永久重定向）。
// 使用相对路径，保证本地预览与线上行为一致。
export const prerender = false;

export const GET: APIRoute = () =>
  new Response(null, {
    status: 301,
    headers: { Location: `/${xDefaultLang}/` },
  });
