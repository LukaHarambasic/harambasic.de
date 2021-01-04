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
      posts: await $content('posts').sortBy('published').fetch(),
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Blog - ${this.globals.title}`,
        description: 'Here you find all my blog posts.',
        url: `/posts`,
        img: `/luka_harambasic_blog.png`,
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
