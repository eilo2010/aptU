import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import critters from 'astro-critters';

export default defineConfig({
  site: 'https://aptu.net',
  integrations: [
    tailwind(),
    sitemap(),
    critters({
      preload: 'media',
      inlineFonts: true,
      pruneSource: true,
      mergeStylesheets: true,
    })
  ],
  vite: {
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/style.[hash].css';
            }
            return 'assets/[name].[hash][extname]';
          }
        }
      }
    }
  }
});