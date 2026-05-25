import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: '@dns',
    include: ['src/**/*.test.ts'],
    root: import.meta.dirname,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
