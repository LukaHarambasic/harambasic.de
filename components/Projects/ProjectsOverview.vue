<template>
  <section>
    <icons-wrapper
      :stable="true"
      class="navigation next"
      @click.native="onNextPrev('next')"
    >
      <icons-next />
    </icons-wrapper>
    <icons-wrapper
      :stable="true"
      class="navigation prev"
      @click.native="onNextPrev('prev')"
    >
      <icons-back />
    </icons-wrapper>
    <ul ref="projects" class="projects">
      <li
        v-for="project in projects"
        :key="project.slug"
        ref="project"
        class="project"
      >
        <div v-if="project.active" class="status">active</div>
        <div class="meta">
          <img :src="fullImagePath(project.img)" :alt="project.alt" />
        </div>
        <div class="content">
          <h2 class="title" v-text="project.title" />
          <base-meta-list
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
    <base-footnote>
      If you want to learn more about the projects, please do not hesitate to
      send me an
      <a :href="globals.mailto">email</a>.
    </base-footnote>
  </section>
</template>

<script>
import IconsWrapper from '@/components/Icons/IconsWrapper'
import IconsBack from '@/components/Icons/IconsBack'
import IconsNext from '@/components/Icons/IconsNext'
export default {
  name: 'ProjectsList',
  components: { IconsWrapper, IconsNext, IconsBack },
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onNextPrev(direction) {
      const projects = this.$refs.projects
      const project = this.$refs.project[0]
      const currentScrollPosition = projects.scrollLeft
      const newScrollPosition =
        direction === 'next'
          ? currentScrollPosition + project.offsetWidth
          : currentScrollPosition - project.offsetWidth
      projects.scroll(newScrollPosition, 0)
    },
    fullImagePath(img) {
      return `/projects/${img}`
    },
  },
}
</script>

<style lang="sass" scoped>
section
  position: relative
  .navigation
    position: absolute
    z-index: 200
    height: 4rem
    width: 4rem
    top: calc(50% - 2rem)
    box-shadow: $box-shadow
    @media screen and (max-width: $breakpoint-mobile)
      height: 3rem
      width: 3rem
      top: 25%
    &.next
      right: 1rem
      @media screen and (max-width: $breakpoint-mobile)
        right: -1.5rem
    &.prev
      left: 1rem
      @media screen and (max-width: $breakpoint-mobile)
        left: -1.5rem
.projects
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: flex-start
  align-items: stretch
  overflow-x: scroll
  scroll-snap-type: x proximity
  scroll-behavior: smooth
  @media screen and (max-width: $breakpoint-mobile)
    align-items: flex-start
.project
  position: relative
  scroll-snap-align: center
  scroll-behavior: smooth
  margin: 0 4rem 0 4rem
  flex: 1 0 60%
  background: $color-secondary
  border-radius: $border-radius
  padding: 2rem
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: stretch
  align-items: flex-start
  @media screen and (max-width: $breakpoint-mobile)
    flex: 1 0 100%
    margin: 0 1rem 0 1rem
    flex-direction: column
    flex-wrap: nowrap
    justify-content: space-between
    align-content: stretch
    align-items: flex-start
.status
  position: absolute
  top: 1rem
  right: 1rem
  z-index: 500
  border-radius: $border-radius
  background: #48c78e
  box-shadow: $box-shadow
  padding: .25rem .5rem
  font-size: .9rem
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
  line-height: 1.1
  margin: 0 0 .5rem 0
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
    margin: 0 1rem 0 0
    a
      color: $color-primary
      border-bottom: 2px solid rgba($color-primary, 1)
      transition: $animation
      text-decoration: none
      line-height: 1
      &:hover
        text-decoration: none
        border-color: rgba($color-primary, .3)
</style>
