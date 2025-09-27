import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'dist/',
        '**/*.d.ts',
        'coverage/',
        'vitest.config.ts',
        'tests/setup.ts',
        'tests/mocks/**'
      ]
    }
  },
  esbuild: {
    target: 'node14'
  }
})
