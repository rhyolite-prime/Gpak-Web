// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  css: ['~/assets/css/index.css'],
  app: {
    head: {
      title: 'G-PAK Limited | Printing & Packaging',
      meta: [
        { name: 'description', content: 'We are a trusted and most preferred choice in commercial, book and packaging printing in Ghana.' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap'
        }
      ]
    }
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
        proxyApiBaseURL: "https://gpak-api.rhyoliteprime.com/api/services/app/",
        //proxyApiBaseURL: "http://localhost:5062/api/services/app/"
    }
  },
  imports: {
    dirs: ["services"],
  },
})
