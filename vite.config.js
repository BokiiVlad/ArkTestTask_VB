import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  // Vercel під час білді виставляє змінну середовища VERCEL
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

  return {
    // ГОЛОВНЕ: для Vercel -> '/', для GitHub Pages -> '/ArkTestTask_VB/'
    base: command === 'serve' || isVercel ? '/' : '/ArkTestTask_VB/',

    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },

    root: 'src',

    build: {
      sourcemap: true,
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') return 'commonHelpers.js';
            return '[name].js';
          },
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.html')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },

    // Підключаємо postcss-sort-media-queries як PostCSS‑плагін
    css: {
      postcss: {
        plugins: [SortCss({ sort: 'mobile-first' })],
      },
    },

    plugins: [
      injectHTML(),
      // Виправлена маска, щоб ловити всі HTML у src
      FullReload(['./src/**/*.html']),
    ],
  };
});
