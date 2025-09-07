/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});