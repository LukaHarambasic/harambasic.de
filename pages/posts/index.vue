<template>
  <section>
    <h2>Blog</h2>
    <ul>
      <li v-for="post in posts" :key="post.slug">
        <nuxt-link :to="post.path" v-text="post.title" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Index',
  async asyncData({ $content }) {
    const posts = await $content('posts').fetch()
    return {
      posts,
    }
  },
}
</script>

<style scoped></style>
