<template>
  <section>
    <h2>{{ title || 'No valid category' }}</h2>
    <div v-if="isNoValidCategory" class="nuxt-content">
      <p>
        This isn't a valid category. Checkout the
        <nuxt-link to="/categories">categories page</nuxt-link> to see all valid
        categories.
      </p>
    </div>
    <ul v-else>
      <li v-for="post in posts" :key="post.slug" class="h-feed">
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
export default {
  name: 'CategoriesDetails',
  props: {
    title: {
      type: String,
      required: true,
    },
    posts: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isNoValidCategory() {
      return this.posts.length === 0
    },
  },
}
</script>

<style lang="sass" scoped>
.nuxt-content
  text-align: center
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
    border-radius: var(--border-radius)
    padding: 2rem
    &:hover
      color: var(--c-font-on-primary)
      background: var(--c-primary)
      .icon
        background: var(--c-font-on-primary)
        svg
          fill: var(--c-primary)
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
        fill: var(--c-font-on-primary)
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
