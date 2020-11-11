<template>
  <post :item="post" />
</template>

<script>
import Post from '@/components/Post'
export default {
  components: { Post },
  async asyncData({ $content, params }) {
    const post = await $content('posts', params.slug).fetch()
    return {
      post,
    }
  },
  head() {
    return {
      title: this.post.title + '- Luka Harambasic',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.desc,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
