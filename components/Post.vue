<template>
  <article class="item">
    <section>
      <img class="image" :src="fullImagePath(item.img)" :alt="item.alt" />
      <div class="row-space-between">
        <h1 class="title" v-text="item.title" />
        <time class="date">{{ item.createdAt | date }}</time>
      </div>
      <meta-list :items="item.tags" pre-text="Tags:" />
      <nuxt-content class="markdown" :document="item" />
      <div class="links">
        <a
          v-for="link in item.links"
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
import MetaList from '@/components/MetaList'
export default {
  name: 'Item',
  components: { MetaList },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    fullImagePath(img) {
      return `/posts/${img}`
    },
  },
}
</script>

<style lang="sass" scoped>
.item
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: stretch
  align-items: stretch
  @media screen and (max-width: $breakpoint-desktop)
    flex-direction: column
.image
  margin: 0 0 1rem 0
  background: $color-secondary
  padding: 1rem
  border-radius: $border-radius
.date
  background: $color-secondary
  padding: .5rem
  border-radius: $border-radius
  font-size: .9rem
  @media (prefers-color-scheme: dark)
    color: $color-primary
section
  order: 0
  flex: 1 1 auto
  align-self: auto
// content - title
.title
  font-size: 1.75rem
  line-height: 1.1
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 .5rem 0
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
