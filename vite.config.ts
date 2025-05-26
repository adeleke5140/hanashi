/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/popup.html',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/__tests__/setupTests.ts'],
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup_entry: 'popup.html',
        background: 'src/background/background.ts',
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    emptyOutDir: true,
  },
}); 