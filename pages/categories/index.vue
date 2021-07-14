<template>
  <section>
    <h2>Categories</h2>
    <ul>
      <li v-for="category in categories" :key="category.slug" class="h-feed">
        <nuxt-link :to="category.path">
          <div>
            <h2 class="title p-name" v-text="category.title" />
          </div>
          <div class="icon">
            <icons-arrow />
          </div>
        </nuxt-link>
      </li>
    </ul>
    <base-footnote>
      Check out the <a :href="globals.blogFeedURL">RSS feed</a> or
      <a :href="globals.twitterURL">my Twitter account</a>
      to keep up to date.
    </base-footnote>
  </section>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'
import getCategories from 'assets/js/getUniqueCategories'

export default {
  name: 'Categories',
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('publishedAt', 'desc').fetch()
    return {
      posts,
      categories: getCategories(posts),
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: 'Categories',
        description: 'TBD',
        url: `/categories`,
        img: `/social/categories.png`,
        imgAlt: `Categories - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
}
</script>

<style lang="sass" scoped>
ul
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: space-between
  align-items: stretch
li
  > a
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: space-between
    align-content: flex-start
    align-items: flex-start
    text-decoration: none
    color: var(--c-font)
    transition: $animation
    border-radius: $border-radius
    padding: 2rem
    &:hover
      background: var(--c-primary)
      .icon
        background: var(--c-surface)
        svg
          fill: var(--c-secondary)
    @media screen and (max-width: $breakpoint-mobile)
      flex-direction: column
      justify-content: flex-start
      align-items: flex-start
    .icon
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      justify-content: center
      align-content: center
      align-items: center
      background: var(--c-primary)
      border-radius: 50%
      font-size: 1.5rem
      line-height: 1.5rem
      padding: .5rem
      margin:  0 0 0 2rem
      transition: $animation
      @media screen and (max-width: $breakpoint-mobile)
        display: none
      svg
        fill: var(--c-secondary)
        width: 2rem
        height: 2rem
    .title
      font-size: 1.5rem
</style>
