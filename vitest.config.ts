import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.{ts,js}'],
    watch: false,
    include: ['**/*.{test,spec}.{ts,js}'],
  }
});