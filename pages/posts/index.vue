<template>
  <posts-overview :posts="posts" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'
import PostsOverview from '@/components/Posts/PostsOverview'

export default {
  name: 'Index',
  components: { PostsOverview },
  async asyncData({ $content }) {
    return {
      posts: await $content('posts').sortBy('publishedAt', 'desc').fetch(),
    }
  },
  head() {
    const { title, meta } = generatePageData(
      this.$route.fullPath,
      `Blog`,
      'Get insights into what I do and what inspires me.'
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
