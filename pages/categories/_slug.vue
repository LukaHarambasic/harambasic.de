<template>
  <categories-details :title="title" :posts="posts" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'

const getFilteredPosts = (rawPosts, slug) => {
  return rawPosts.filter((post) =>
    post.categories.find((category) => category.slug === slug)
  )
}

const getTitle = (posts, slug) => {
  // Only the slug is available but the title is needed
  const categoryIndex = posts[0].categories.findIndex(
    (category) => category.slug === slug
  )
  return posts[0].categories[categoryIndex].title
}

export default {
  async asyncData({ $content, params }) {
    const rawPosts = await $content('posts')
      .sortBy('publishedAt', 'desc')
      .fetch()
    const posts = getFilteredPosts(rawPosts, params.slug)
    const title = posts.length > 0 ? getTitle(posts, params.slug) : ''
    return {
      posts,
      title,
    }
  },
  head() {
    const { title, meta } = generatePageData(
      this.title,
      `A list of all posts in the category ${this.title}. Haven fun! :)`
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>
