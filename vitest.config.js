// import { fileURLToPath } from 'node:url'
// import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
// import viteConfig from './vite.config'

// export default mergeConfig(
//   viteConfig,
//   defineConfig({
//     test: {
//       environment: 'jsdom',
//       exclude: [...configDefaults.exclude, 'e2e/**'],
//       root: fileURLToPath(new URL('./', import.meta.url))
//     }
//   })
// )

import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

const viteBaseConfig = defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-vercel-flax.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});

export default mergeConfig(
  viteBaseConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url))
    }
  })
);
