import marked from 'marked'
import readingTime from 'reading-time'

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
      { property: 'og:site_name', content: globals.title || '' },
      { property: 'og:image:width', content: '740' },
      { property: 'og:image:height', content: '300' },
      { name: 'twitter:site', content: globals.twitterHandle || '' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: globals.baseURL,
      },
    ],
  },
  /*
   * Global CSS
   */
  css: ['@/assets/style/main.sass', '@/assets/style/fontfaces.css'],
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
    const baseUrlPosts = `${globals.baseURL}/posts`
    const baseLinkFeedPosts = '/posts'
    const feedFormats = {
      rss: { type: 'rss2', file: 'rss.xml' },
      json: { type: 'json1', file: 'feed.json' },
    }
    const { $content } = require('@nuxt/content')
    const createFeed = async function (feed) {
      feed.options = {
        title: globals.title || '',
        description: globals.desc || '',
        link: baseUrlPosts,
      }
      const posts = await $content('posts').fetch()
      posts.forEach((post) => {
        const url = `${baseUrlPosts}/${post.slug}`
        feed.addItem({
          title: posts.title,
          id: url,
          link: url,
          date: new Date(post.publishedAt),
          description: post.description,
          content: post.html,
          author: globals.twitterHandle,
        })
      })
    }
    return Object.values(feedFormats).map(({ file, type }) => ({
      path: `${baseLinkFeedPosts}/${file}`,
      type,
      create: createFeed,
    }))
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
          sizes: 'xs:200px md:500px lg:1024px',
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
      if (document.extension === '.md') {
        document.readingTime = readingTime(document.text)
        document.html = marked(document.text)
      }
    },
  },
}
