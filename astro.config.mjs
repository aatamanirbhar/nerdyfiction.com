// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nerdyfiction.com',
  trailingSlash: 'never',
  output: 'static',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    tailwind({ applyBaseStyles: true }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      // Higher priority for homepage and book pages
      serialize(item) {
        item.lastmod = new Date().toISOString();
        if (item.url === 'https://nerdyfiction.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        if (/\/books\/[^/]+$/.test(item.url)) {
          item.priority = 0.9;
        }
        if (/\/books\/[^/]+\/chapter-\d+$/.test(item.url)) {
          item.priority = 0.85;
        }
        return item;
      },
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['gsap'],
    },
  },
});
