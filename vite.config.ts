/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    setupFiles: './setupVitest.ts',
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: true,
  },
  resolve: {
    conditions: ['development', 'browser']
  }
});
