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
  // generate: {
  //   routes: [
  //     '/admin/posts/edit/:id',
  //     '/admin/posts/:id',

  //     '/admin/categories/edit/:id',
  //     '/admin/categories/:id',

  //     '/admin/comments/edit/:id',
  //     '/admin/comments/:id',
  //   ]
  // },
  modules: ['@sidebase/nuxt-session'],
  session: {
    isEnabled: true,
    session: {
      expiryInSeconds: 3600,
    }
  },
  plugins: [
    '~/plugins/auth.js',
    '~/plugins/api.js'
  ]
})