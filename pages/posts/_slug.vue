<template>
  <item :item="post" />
</template>

<script>
import Item from '~/components/Item'
export default {
  components: { Item },
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
