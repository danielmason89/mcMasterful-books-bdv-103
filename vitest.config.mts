import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.{ts,js}'],
    watch: false,
    include: ['**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    testTimeout: 10000,
    hookTimeout: 60000, 
  }
});