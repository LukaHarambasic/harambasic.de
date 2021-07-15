<template>
  <categories-details :title="title" :posts="posts" />
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'

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
    return {
      posts,
      title: getTitle(posts, params.slug),
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: 'Categories',
        description: `A list of all posts in the category ${this.title}. Haven fun! :)`,
        url: `/categories/${this.$route.params.slug}`,
        img: `/social/${this.$route.params.slug}.png`,
        imgAlt: `Category: ${this.title} - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
}
</script>
