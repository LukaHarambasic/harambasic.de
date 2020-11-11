<template>
  <PostsList :items="posts" />
</template>

<script>
import PostsList from '@/components/PostsList'
export default {
  name: 'Index',
  components: { PostsList },
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('created').fetch()
    return {
      posts,
    }
  },
  head() {
    return {
      title: 'Blog - Luka Harambasic',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'This is my blog.',
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
