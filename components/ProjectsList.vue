<template>
  <section>
    <ul class="projects">
      <li v-for="item in items" :key="item.slug" class="project">
        <div class="meta">
          <img :src="item.img" :alt="item.alt" />
        </div>
        <div class="content">
          <h2 class="title" v-text="item.title" />
          <ul class="responsibilities">
            <li><h6>Responsibilities:</h6></li>
            <li
              v-for="responsibility in item.responsibilities"
              :key="responsibility"
              v-text="responsibility"
            />
          </ul>
          <nuxt-content class="description" :document="item" />
          <ul class="links">
            <li v-for="link in item.links" :key="link.title">
              <a class="link" :href="link.url" v-text="link.title" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'ProjectsList',
  props: {
    items: {
      type: Array,
      required: true,
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
  width: 100%
  margin: 0 0 4rem 0
  background: $color-secondary
  border-radius: $border-radius
  padding: 2rem
  display: flex
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
  img
    border-radius: $border-radius
.content
  width: calc(70% - 2rem)
.title
  font-size: 1.75rem
.responsibilities
  opacity: .8
  font-size: .9rem
  margin: .5rem 0 1rem 0
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
    &:last-of-type,
    &:first-of-type
      &:after
        content: ''
  h6
    text-transform: uppercase
.links
  margin: 1rem 0 0 0
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
      border-bottom: 1px solid $color-primary
      transition: $animation
      text-decoration: none
      &:hover
        text-decoration: none
        border-color: transparent
</style>
