<template>
  <posts-overview :posts="posts" />
</template>

<script>
import PostsOverview from '@/components/Posts/PostsOverview'
import global from '@/assets/js/global'
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
      // TODO name form globals
      const metaData = {
        title: `Blog - Luka Harambasic`,
        description: 'Here you find all my blog posts.',
        url: `/posts`,
        img: `/luka_harambasic_blog.png`,
        imgAlt: 'Blog - Luka Harambasic',
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      // TODO name form globals
      title: `Blog - Luka Harambasic`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${global.baseURL}/posts`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
