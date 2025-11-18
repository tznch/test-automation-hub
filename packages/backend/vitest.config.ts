import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        'src/test/**',
        'src/routes/*.test.ts',
        'src/utils/*.test.ts',
        'src/models/*.test.ts',
      ],
    },
    include: ['src/__tests__/**/*.test.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
