// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  // devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      title: "Admission Assistant",
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {hid: 'description', name: 'description', content: ''},
        {hid: 'og:title', name: 'og:title', content: 'Admission Assistant'},
        {hid: 'og:description', name: 'og:description', content: 'Admission Assistant'},
      ],
    }
  },
  build: { transpile: ['@vee-validate/rules'] },
  modules: ["@nuxtjs/tailwindcss", '@pinia/nuxt'],
  plugins: ['@/plugins/flowbite.client.js'],
  // plugins: [{ src: "~/plugins/katex.client.js", mode: "client" }],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://127.0.0.1:8000/api/',
    },
  }
})