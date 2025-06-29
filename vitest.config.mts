import { defineConfig } from 'vitest/config';
import openApiPlugin from './vitest-openapi-plugin'


export default defineConfig({
  plugins: [openApiPlugin],
  test: {
    globals: true,
    environment: 'node',
    includeSource: ['src/**/*.{ts,js}'],
    watch: false,
    include: ['**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    exclude: ['src/generated/**', 'client/**'],
    testTimeout: 10000,
    hookTimeout: 60000, 
  }
});