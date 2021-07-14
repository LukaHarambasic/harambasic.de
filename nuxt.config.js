import marked from 'marked'
import readingTime from 'reading-time'

import { getCategoryMeta } from './assets/js/getCategoryMeta'
import getFeed from './assets/js/getFeed'
import globals from './assets/js/globals'
import getRoutes from './assets/js/getRoutes'
import getSiteMeta from './assets/js/getMeta'

const meta = getSiteMeta()

export default {
  /*
   * Nuxt target
   * See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   * Headers of the page
   * See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: globals.title,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      ...meta,
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
        content: globals.desc || '',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: globals.title || '',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: globals.desc || '',
      },
      { hid: 'og:image', property: 'og:image', content: globals.img || '' },
      { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
      { hid: 'og:image:height', property: 'og:image:height', content: '630' },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: globals.twitterHandle || '',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: globals.img || '',
      },
      {
        hid: 'twitter:image:alt',
        name: 'twitter:image:alt',
        content: globals.imgAlt || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
   * Global CSS
   */
  css: [
    '@/assets/style/variables.css',
    '@/assets/style/main.sass',
    '@/assets/style/fontfaces.css',
  ],
  /*
   * Load Variables
   */
  styleResources: {
    sass: ['@/assets/style/_variables.sass'],
  },
  /*
   * Plugins to load before mounting the App
   * https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/plugins/mixins.js',
    '@/plugins/filters.js',
    {
      src: '@/plugins/googleAnalytics.js',
      mode: 'client',
    },
  ],
  /*
   * Auto import components
   * See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   * Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-analytics',
  ],
  /*
   * Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/feed',
    '@nuxtjs/sitemap',
  ],
  /*
   * Content module configuration
   * See https://content.nuxtjs.org/configuration
   */
  content: {
    liveEdit: false,
    markdown: {
      rehypePlugins: ['~/plugins/rehype-post-image.js'],
    },
  },
  /*
   * Build configuration
   * See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /*
   * Sitemap Configuration (https://github.com/nuxt-community/sitemap-module)
   * Inspired by https://github.com/garethredfern/nuxt-basic-blog
   */
  sitemap: {
    hostname: globals.baseURL,
    trailingSlash: true,
    routes() {
      return getRoutes()
    },
  },
  /*
   * RSS Feed Configuration (https://github.com/nuxt-community/feed-module)
   * Inspired by https://github.com/garethredfern/nuxt-basic-blog
   */
  feed() {
    return getFeed()
  },
  /*
   * f
   */
  image: {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
    presets: {
      post: {
        modifiers: {
          sizes: 'xs:320px md:768px lg:1024px',
        },
      },
    },
  },
  /*
   * Hook to render markdown as html for the rss feed,
   * also adds reading time (currently not used)
   */
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.dir.includes('post')) {
        document.readingTime = readingTime(document.text)
        document.html = marked(document.text)
        document.categories = getCategoryMeta(document.categories)
        document.url = `${globals.baseURL}${document.path}`
        document.author = document.author || globals.author
        document.authorUrl = document.authorURL || globals.baseURL
      }
    },
  },
}
