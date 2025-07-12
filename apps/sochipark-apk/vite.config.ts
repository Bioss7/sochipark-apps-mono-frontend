/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/sochipark-apk',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@sochipark-apps-mono-frontend/ui': path.resolve(
        __dirname,
        '../../libs/shared/ui/src'
      ),
      '@sochipark-apps-mono-frontend/sochipark-apk-features': path.resolve(
        __dirname,
        '../../libs/sochipark-apk-features/src'
      ),
      '@styles': path.resolve(__dirname, '../../libs/shared/ui/src/lib/styles'),
      '@assets': path.resolve(__dirname, '../../libs/shared/ui/src/lib/assets'),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
