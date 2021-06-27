import globals from './globals.js'
const { $content } = require('@nuxt/content')

const BASE_URL_POSTS = `${globals.baseURL}/posts`

export default () => {
  const baseLinkFeedPosts = '/posts'
  const feedFormats = {
    rss: { type: 'rss2', file: 'rss.xml' },
    json: { type: 'json1', file: 'feed.json' },
  }
  return Object.values(feedFormats).map(({ file, type }) => ({
    path: `${baseLinkFeedPosts}/${file}`,
    type,
    create: _createFeed,
  }))
}

const _createFeed = async function (feed) {
  feed.options = {
    title: globals.title || '',
    description: globals.desc || '',
    link: BASE_URL_POSTS,
  }
  const posts = await $content('posts').fetch()
  posts.forEach((post) => {
    const url = `${BASE_URL_POSTS}/${post.slug}`
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
