<template>
  <PostsList :items="posts" />
</template>

<script>
import PostsList from '@/components/PostsList'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'
export default {
  name: 'Index',
  components: { PostsList },
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('published').fetch()
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
        imgAlt: 'Blog - Luka Harambasic',
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
