<template>
  <article class="project">
    <aside>
      <img class="image" :src="project.img" :alt="project.alt" />
      <div class="meta">
        <div class="time" v-text="project.time" />
        <ul class="tags">
          <li v-for="tag in project.tags" :key="tag" class="tag" v-text="tag" />
        </ul>
      </div>
    </aside>
    <section>
      <h1 class="title" v-text="project.title" />
      <hr class="divider" />
      <nuxt-content class="markdown" :document="project" />
      <div class="links">
        <a
          v-for="link in project.links"
          :key="link.title"
          class="link"
          :href="link.url"
          v-text="link.title"
        />
      </div>
    </section>
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const project = await $content('projects', params.slug).fetch()
    return {
      project,
    }
  },
}
</script>

<style lang="sass" scoped>
.project
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: stretch
  align-items: stretch
// sidebar
aside
  order: 0
  flex: 1 0 20rem
  align-self: auto
  background: $color-light
  margin: 0 4rem 0 0
  .image
    margin: 0 0 1rem 0
    background: $color-secondary
    padding: 1rem
    border-radius: $border-radius
  .meta
    margin: 0 0 2rem 0
    font-size: 1.2rem
    .time
      margin: 0 0 1rem 0
      font-weight: bold
    .tags
      flex-direction: row
      flex-wrap: nowrap
      justify-content: flex-start
      align-content: flex-start
      align-items: flex-start
      .tag
        font-size: 1rem
        display: inline-block
        background: $color-secondary
        padding: .5rem 1rem
        border-radius: $border-radius
        margin: 0 .5rem .5rem 0
// content
section
  order: 0
  flex: 1 1 auto
  align-self: auto
// content - title
.title
  font-size: 3rem
  margin: 0 0 0 0
// content - divider
.divider
  height: .5rem
  width: 100%
  margin: 0 0 2rem 0
  border-radius: $border-radius
  border: none
  background: $color-secondary
// content - markdown
.markdown
  margin: 0 0 2rem 0
// content - links
.links
  .link
    display: inline-block
    background: $color-primary
    color: $color-light
    padding: .75rem 1rem
    border-radius: $border-radius
    margin: 0 1rem 1rem 0
    text-decoration: none
    border: 2px solid $color-primary
    transition: $animation
    &:hover
      background: $color-light
      color: $color-primary
</style>
