<template>
  <section>
    <ul>
      <nuxt-link
        v-for="project in projects"
        :key="project.slug"
        :to="project.path"
        tag="li"
      >
        <img class="image" :src="project.img" :alt="project.alt" />
        <h2 class="title" v-text="project.title" />
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
  width: calc((100% / 3) - (8rem / 3)) //4rem between the 3 projects per row, space between can't be used as rows arent't filled from the start
  margin: 0 4rem 4rem 0
  background: $color-secondary
  border-radius: $border-radius
  padding: 1.5rem
  transition: $animation
  &:nth-child(3n+3)
    margin: 0 0 4rem 0
  &:hover
    cursor: pointer
    transform: scale(1.05)
    .image
      filter: grayscale(0%)
      opacity: 1
.image
  margin: 0 0 1rem 0
  height: 20rem
  width: 100%
  object-fit: cover
  transition: $animation
  filter: grayscale(100%)
  opacity: 0.7
.title
  font-size: 1.2rem
  margin: 0
  text-align: center
</style>
