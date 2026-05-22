import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: '@dns',
    include: ['src/**/*.test.ts'],
    root: import.meta.dirname,
  },
})
