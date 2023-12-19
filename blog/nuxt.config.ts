// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  generate: {
    routes: [
      '/admin/posts/edit/:id',
      '/admin/posts/:id',
    ]
  },
  modules: ['@sidebase/nuxt-session'],
  session: {
    isEnabled: true,
    session: {
      expiryInSeconds: 3600,
    }
  }
})