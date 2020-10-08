<template>
  <Items :items="posts" />
</template>

<script>
import Items from '~/components/Items'
export default {
  name: 'Index',
  components: { Items },
  async asyncData({ $content }) {
    const posts = await $content('posts')
      .only(['title', 'path', 'slug', 'img', 'alt', 'dir'])
      .sortBy('title')
      .fetch()
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
