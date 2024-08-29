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


import { fileURLToPath, URL } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config';

// Export de la configuration de Vitest fusionnée avec la configuration de Vite
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom', // Environnement de test
      exclude: [...configDefaults.exclude, 'e2e/**'], // Exclure les tests e2e
      root: fileURLToPath(new URL('./', import.meta.url)) // Répertoire racine des tests
    }
  })
);
