// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },

  compatibilityDate: '2025-09-21',

  nitro: {
    preset: 'netlify',
    experimental: {
      wasm: true
    }
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: false
  },

  // Reduce build warnings and improve performance
  vite: {
    build: {
      rollupOptions: {
        external: ['fsevents']
      }
    }
  }
})