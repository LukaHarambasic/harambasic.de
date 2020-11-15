<template>
  <PostsList :items="posts" />
</template>

<script>
import PostsList from '@/components/PostsList'
import global from '@/utils/global'
import getSiteMeta from '@/utils/getMeta'
export default {
  name: 'Index',
  components: { PostsList },
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('created').fetch()
    return {
      posts,
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Blog - Luka Harambasic`,
        description: 'Here you find all my blog posts.',
        url: `/posts`,
        img: `/luka_harambasic_blog.png`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
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
