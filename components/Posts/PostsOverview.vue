<template>
  <section>
    <h2>Blog</h2>
    <div class="categories">
      <select v-model="selectedCategorySlug">
        <option value="">All</option>
        <option
          v-for="category in categories"
          :key="category.slug"
          :value="category.slug"
        >
          {{ category.title }}
        </option>
      </select>
    </div>
    <ul>
      <li v-for="post in filteredPosts" :key="post.slug" class="h-feed">
        <nuxt-link :to="post.path">
          <div class="meta">
            <h2 class="title p-name" v-text="post.title" />
            <time class="date dt-published" :datetime="post.publishedAt">
              <a :href="post.url" class="u-url">
                {{ post.publishedAt | date }}
              </a>
            </time>
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
import IconsArrow from '@/components/Icons/IconsArrow'
import getCategories from 'assets/js/getUniqueCategories'

export default {
  name: 'PostsOverview',
  components: { IconsArrow },
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      categories: getCategories(this.posts),
      selectedCategorySlug: '',
    }
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategorySlug === '') return this.posts
      return this.posts.filter((post) =>
        post.categories.find(
          (category) => category.slug === this.selectedCategorySlug
        )
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.categories
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-end
  align-content: flex-start
  align-items: flex-start
  margin: 0 0 .5rem 0
  select
    color: var(--c-font)
    border: none
    border-bottom: 2px solid var(--c-font)
    background: none
    font-size: 1rem
    padding: 0.05rem 0.1rem
    margin: 0 0.5rem
    transition: $animation
    border-radius: $border-radius
    &:hover
      cursor: pointer
      border-color: var(--c-font-hover)
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
      margin:  0 0 0 1rem
      transition: $animation
      @media screen and (max-width: $breakpoint-mobile)
        display: none
      svg
        fill: var(--c-font)
        width: 2rem
        height: 2rem
    .title
      font-size: 1.5rem
    .date
      font-size: 1rem
      @media screen and (max-width: $breakpoint-mobile)
        margin: .5rem 0 0 0
      a
        color: var(--c-font)
        text-decoration: none
        transition: $animation
        border-bottom: 2px solid transparent
        &:hover
          border-color: var(--c-font)
</style>
