import marked from 'marked'
import readingTime from 'reading-time'

import global from './utils/global'
import getRoutes from './utils/getRoutes'
import getSiteMeta from './utils/getMeta'

const meta = getSiteMeta()

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
    title: global.title,
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
        content: global.desc || '',
      },
      { property: 'og:site_name', content: global.title || '' },
      { property: 'og:image:width', content: '740' },
      { property: 'og:image:height', content: '300' },
      { name: 'twitter:site', content: global.title || '' },
      { name: 'twitter:card', content: 'summary_large_image' },
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
  plugins: [
    '@/plugins/filters.js',
    '@/plugins/globals.js',
    {
      src: '@/plugins/googleAnalytics.js',
      mode: 'client',
    },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-analytics',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/feed',
    '@nuxtjs/sitemap',
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

  // Sitemap Configuration (https://github.com/nuxt-community/sitemap-module)
  // Inspired by https://github.com/garethredfern/nuxt-basic-blog
  sitemap: {
    hostname: global.baseURL,
    routes() {
      return getRoutes()
    },
  },

  // RSS Feed Configuration (https://github.com/nuxt-community/feed-module)
  // Inspired by https://github.com/garethredfern/nuxt-basic-blog
  feed() {
    const baseUrlPosts = `${global.baseURL}/posts`
    const baseLinkFeedPosts = '/posts'
    const feedFormats = {
      rss: { type: 'rss2', file: 'rss.xml' },
      json: { type: 'json1', file: 'feed.json' },
    }
    const { $content } = require('@nuxt/content')
    const createFeed = async function (feed) {
      feed.options = {
        title: global.title || '',
        description: global.desc || '',
        link: baseUrlPosts,
      }
      const posts = await $content('posts').fetch()
      posts.forEach((post) => {
        const url = `${baseUrlPosts}/${post.slug}`
        feed.addItem({
          title: posts.title,
          id: url,
          link: url,
          date: new Date(post.createdAt),
          description: post.description,
          content: post.html,
          author: global.twitterHandle,
        })
      })
    }
    return Object.values(feedFormats).map(({ file, type }) => ({
      path: `${baseLinkFeedPosts}/${file}`,
      type,
      create: createFeed,
    }))
  },
  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        document.readingTime = readingTime(document.text)
        document.html = marked(document.text)
      }
    },
  },
}
