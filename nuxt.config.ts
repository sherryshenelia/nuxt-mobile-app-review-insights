// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon'
  ],
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    // Public keys that are exposed to client-side
    public: {
      apiBase: '/api'
    }
  },
  
  typescript: {
    strict: true
  }
})
