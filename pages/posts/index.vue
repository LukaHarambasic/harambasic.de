<template>
  <posts-overview :posts="posts" />
</template>

<script>
import getSiteMeta from 'assets/js/pageData'
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
    const { content } = this.meta.find((item) => item.hid === 'og:title')
    return {
      title: content,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: 'Blog',
        description: 'Want to see something new? Checkout some blog posts.',
        url: `/posts`,
        img: `/social/blog.png`,
        imgAlt: `Blog - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
