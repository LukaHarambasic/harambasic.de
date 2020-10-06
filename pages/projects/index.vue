<template>
  <section>
    <ul>
      <nuxt-link
        v-for="project in projects"
        :key="project.slug"
        :to="project.path"
        tag="li"
      >
        <h2 class="title" v-text="project.title" />
        <img class="image" :src="project.img" :alt="project.alt" />
      </nuxt-link>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Index',
  async asyncData({ $content, params }) {
    const projects = await $content('projects')
      .only(['title', 'path', 'slug', 'img', 'alt'])
      .fetch()
    return {
      projects,
    }
  },
}
</script>

<style lang="sass" scoped>
ul
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: flex-start
  align-content: stretch
  align-items: stretch
li
  width: calc((100% / 3) - (4rem / 3))
  margin: 0 2rem 2rem 0
  background: $color-secondary
  padding: 1rem
  border-radius: $border-radius
  &:nth-child(3)
    margin: 0 0 2rem 0
.title
  font-size: 1.2rem
  margin: 0 0 1rem 0
</style>
