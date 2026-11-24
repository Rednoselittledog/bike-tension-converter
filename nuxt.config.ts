// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'th' },
      title: 'Spoke tension converter',
      meta: [
        { name: 'description', content: 'Convert bicycle spoke gauge readings and tension.' },
      ],
    },
  },
})
