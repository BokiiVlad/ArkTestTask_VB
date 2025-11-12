import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import sortMediaQueries from 'postcss-sort-media-queries';

export default defineConfig(({ command }) => {
  // Vercel під час збірки виставляє системну змінну середовища VERCEL=1
  // (див. офіційну доку нижче)
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

  return {
    // ГОЛОВНЕ: правильна база для обох середовищ
    base: isVercel ? '/' : '/ArkTestTask_VB/',

    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },

    root: 'src',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: chunkInfo => {
            if (chunkInfo.name === 'commonHelpers') {
              return 'commonHelpers.js';
            }
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
      outDir: '../dist',
      emptyOutDir: true,
    },

    // Переносимо postcss-sort-media-queries у PostCSS-плагіни,
    // а не у Vite plugins (це саме PostCSS-плагін)
    css: {
      postcss: {
        plugins: [
          sortMediaQueries({ sort: 'mobile-first' }),
        ],
      },
    },

    plugins: [
      injectHTML(),
      FullReload(['./src/**/*.html']), // трошки охайніший патерн
      // ⛔️ НЕ додаємо сюди postcss-sort-media-queries
    ],
  };
});