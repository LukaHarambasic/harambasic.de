<template>
  <section>
    <ul class="projects">
      <li v-for="project in projects" :key="project.slug" class="project">
        <div class="meta">
          <img :src="fullImagePath(project.img)" :alt="project.alt" />
        </div>
        <div class="content">
          <h2 class="title" v-text="project.title" />
          <meta-list
            :items="project.responsibilities"
            pre-text="Responsibilities:"
          />
          <nuxt-content class="description stable-color" :document="project" />
          <ul class="links">
            <li v-for="link in project.links" :key="link.title">
              <a class="link" :href="link.url" v-text="link.title" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- TODO: mail from global-->
    <p class="nuxt-content info">
      If you want to learn more about the projects, please do not hesitate to
      send me an
      <a href="mailto:hi@harambasic.de">Email</a>.
    </p>
  </section>
</template>

<script>
import MetaList from '@/components/Base/BaseMetaList'
export default {
  name: 'ProjectsList',
  components: { MetaList },
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  methods: {
    fullImagePath(img) {
      return `/projects/${img}`
    },
  },
}
</script>

<style lang="sass" scoped>
.projects
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: flex-start
  align-items: flex-start
.project
  margin: 0 0 4rem 0
  background: $color-secondary
  border-radius: $border-radius
  padding: 2rem
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: stretch
  align-items: flex-start
  &:last-of-type
    margin: 0
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
    flex-wrap: nowrap
    justify-content: space-between
    align-content: stretch
    align-items: flex-start
.meta
  width: 30%
  background: $color-light
  border-radius: $border-radius
  padding: 1rem
  box-shadow: $box-shadow
  @media screen and (max-width: $breakpoint-mobile)
    width: 100%
  img
    border-radius: $border-radius
.content
  width: calc(70% - 2rem)
  color: $color-primary
  @media screen and (max-width: $breakpoint-mobile)
    width: 100%
    margin: 2rem 0 0 0
.title
  font-size: 1.75rem
.description
  margin: 2rem 0 0 0
.links
  margin: 2rem 0 0 0
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: flex-start
  align-content: flex-start
  align-items: flex-start
  li
    margin: 0 .15rem 0 0
    &:after
      content: ', '
    &:last-of-type
      &:after
        content: ''
    a
      color: $color-primary
      border-bottom: 2px solid rgba($color-primary, 1)
      transition: $animation
      text-decoration: none
      line-height: 1
      &:hover
        text-decoration: none
        border-color: rgba($color-primary, .3)

.info
  font-size: 1rem
  text-align: center
  margin: 2rem 0 0 0
</style>
