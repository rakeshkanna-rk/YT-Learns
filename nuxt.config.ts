// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  alias: {
      "@": resolve(__dirname, "./"),
    },
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      link:[
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        }
      ]
    },
  },
})