<template>
  <posts-overview :posts="posts" />
</template>

<script>
import PostsOverview from '@/components/Posts/PostsOverview'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Index',
  components: { PostsOverview },
  async asyncData({ $content }) {
    return {
      posts: await $content('posts').sortBy('publishedAt', 'desc').fetch(),
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
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
