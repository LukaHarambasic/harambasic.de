<template>
  <article class="post"></article>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const post = await $content('posts', params.slug).fetch()
    return {
      post,
    }
  },
}
</script>

<style lang="sass" scoped></style>
