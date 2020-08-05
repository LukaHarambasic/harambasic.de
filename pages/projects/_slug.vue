<template>
  <article
    class="project"
    :style="{ background: project.background, color: color }"
  >
    <div class="scrollable">
      <div
        class="image-container"
        :style="{ background: highlights, color: color }"
      >
        <img class="image" :src="project.img" :alt="project.alt" />
      </div>
      <div class="content-container">
        <h1 class="title" v-text="project.title" />
        <div class="meta" :style="{ background: highlights, color: color }">
          <div class="time" v-text="project.time" />
          <ul class="topics">
            <li
              v-for="topic in project.topics"
              :key="topic"
              class="topic"
              v-text="topic"
            />
          </ul>
        </div>
        <nuxt-content class="markdown" :document="project" />
        <div class="links">
          <a
            v-for="link in project.links"
            :key="link.title"
            class="link"
            :href="link.url"
            :style="{ background: highlights, color: color }"
            v-text="link.title"
          />
        </div>
      </div>
    </div>
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
  computed: {
    color() {
      // TODO get colors from variables instead of static values
      return this.project.color === 'light' ? '#fff' : 'rgba(0, 0, 0, .8)'
    },
    highlights() {
      // TODO get colors from variables instead of static values
      return this.project.color === 'light' ? 'rgba(0, 0, 0, .8)' : '#fff'
    },
  },
}
</script>

<style lang="sass" scoped>
.project
  width: calc(100vw - 8rem)
  height: calc(100vh - 8rem)
  padding: 4rem
  position: fixed
// scrollable - to keep the padding while scrolling
.scrollable
  overflow-y: auto
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: flex-start
  align-items: flex-start
  width: 100%
  height: 100%
// image
.image-container
  width: 40%
  padding: 2rem
  background: $color-light
  .image
    opacity: .7
    transition: $animation
    &:hover
      opacity: 1
// content
.content-container
  width: 60%
  padding: 0 0 0 4rem
// content - title
.title
  font-size: 3rem
  margin: 0 0 1rem 0
// content - meta
.meta
  margin: 0 0 2rem 0
  padding: 2rem
  background: $color-light
  font-size: 1.2rem
  .time
    margin: 0 0 1rem 0
    font-weight: bold
  .topics
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    .topic
      display: inline
      &:after
        content: ', '
      &:last-of-type
        &:after
          content: ''
// content - markdown
.markdown
  margin: 0 0 2rem 0
// content - links
.links
  .link
    background: $color-light
    padding: .75rem 1rem
    margin: 0 1rem 0 0
    text-decoration: none
    color: $color-dark
    display: inline-block
    &:hover
      text-decoration: underline
</style>
