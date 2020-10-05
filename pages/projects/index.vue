<template>
  <section>
    <h2>Portfolio</h2>
    <ul>
      <li v-for="project in projects" :key="project.slug">
        <nuxt-link :to="project.path" v-text="project.title" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Index',
  async asyncData({ $content, params }) {
    const projects = await $content('projects')
      .only(['title', 'path', 'slug'])
      .fetch()
    return {
      projects,
    }
  },
}
</script>

<style scoped></style>
