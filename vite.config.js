import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import seoPlugin from './config/seoPlugin.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), seoPlugin(env.VITE_SITE_URL)],
    server: { port: 3000 },
    // The three.js hero chunk is lazy-loaded, so its size is intentional.
    build: { outDir: 'build', chunkSizeWarningLimit: 600 },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      css: false,
    },
  };
});
