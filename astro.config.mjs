import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://sanamluangbangkok.com',
  // 统一使用带尾斜线的规范 URL：/en/ 与 /en 会被搜索引擎当成两个页面，
  // 这里让 Astro 生成的链接、canonical 与内部跳转全部对齐到带斜线版本，
  // 非规范 URL 由 public/_redirects 做 301 收敛。
  trailingSlash: 'always',
  // 默认静态生成；需要按请求取数的路由（如首页实时天气）单独声明 prerender = false。
  output: 'static',
  adapter: cloudflare({
    // 本地开发时模拟 Cloudflare 运行时（assets 等绑定）
    platformProxy: { enabled: true },
  }),
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  build: {
    // 图片已做压缩与规范命名，无需再走内置优化管线
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
