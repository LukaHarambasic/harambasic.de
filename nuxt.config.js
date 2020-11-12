export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Luka Harambasic',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'theme-color',
        content: '#e2ebf0',
      },
      { name: 'HandheldFriendly', content: 'True' },
      {
        hid: 'description',
        name: 'description',
        content: 'Get to know me, my projects and some of my ideas.',
      },
      { property: 'og:site_name', content: 'Luka Harambasic' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://harambasic.de',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Luka Harambasic',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Get to know me, my projects and some of my ideas.',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/luka-harambasic-preview.png',
      },
      { property: 'og:image:width', content: '740' },
      { property: 'og:image:height', content: '300' },

      { name: 'twitter:site', content: '@luka_digital' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: 'https://harambasic.de',
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Luka Harambasic',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Get to know me, my projects and some of my ideas.',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: '/luka-harambasic-preview.png',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: 'https://harambasic.de',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: ['~assets/style/main.sass'],
  /*
   ** Load Variables
   */
  styleResources: {
    sass: ['~assets/style/_variables.sass'],
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [{ src: '@/plugins/filters.js' }],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/style-resources'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
  ],
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
