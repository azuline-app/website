import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Static site for azuline.app, deployed to Cloudflare Pages. Security headers are written to dist/_headers
// after the build by scripts/headers.ts, with hashes of the inline scripts the build produced.
export default defineConfig({
  site: 'https://azuline.app',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.includes('/og/') })],
});
