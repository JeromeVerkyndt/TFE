import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    test: {
      globals: true,          // ⬅️ Permet d'utiliser expect, test, describe sans les importer
      environment: 'jsdom',   // ⬅️ Simule un navigateur pour tester les composants React
      setupFiles: './src/setupTests.js', // ⬅️ Fichier où on importe jest-dom
    },
  };
});
