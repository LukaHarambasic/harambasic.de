<template>
  <section>
    <ul>
      <li class="h-feed">
        <nuxt-link v-for="item in items" :key="item.slug" :to="item.path">
          <div class="meta">
            <h2 class="title p-name" v-text="item.title" />
            <time class="date dt-published" :datetime="item.createdAt">
              <a :href="fullPath" class="u-url">{{ item.createdAt | date }}</a>
            </time>
          </div>
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M9.31 6.71c-.39.39-.39 1.02 0 1.41L13.19 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.72 6.7c-.38-.38-1.02-.38-1.41.01z"
              />
            </svg>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <div class="update nuxt-content">
      <p>
        Check out the <a href="/posts/rss.xml">RSS feed</a> or
        <a href="https://twitter.com/luka_harambasic">my Twitter account</a>
        to keep up to date.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Items',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    fullPath(path) {
      return `https://harambasic.de${path}`
    },
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
    align-items: center
    margin: 0 0 1rem 0
    text-decoration: none
    color: $color-primary
    transition: $animation
    border-radius: $border-radius
    padding: 1rem
    @media (prefers-color-scheme: dark)
      color: $color-light
      &:hover
        color: $color-primary
    @media screen and (max-width: $breakpoint-mobile)
      flex-direction: column
      justify-content: flex-start
      align-items: flex-start
    &:hover
      background: $color-secondary
      .icon
        background: $color-light
        svg
          fill: $color-primary
      .date
        a
          color: $color-primary
      @media (prefers-color-scheme: dark)
        .icon
          background: $color-primary
          svg
            fill: $color-secondary
    .icon
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      justify-content: center
      align-content: center
      align-items: center
      background: $color-secondary
      border-radius: 50%
      font-size: 1.5rem
      line-height: 1.5rem
      padding: .5rem
      transition: $animation
      @media screen and (max-width: $breakpoint-mobile)
        display: none
      svg
        fill: $color-primary
        width: 2rem
        height: 2rem
    .title
      font-size: 1.5rem
    .date
      font-size: 1rem
      @media screen and (max-width: $breakpoint-mobile)
        margin: .5rem 0 0 0
      a
        color: $color-primary
        text-decoration: none
        transition: $animation
        border-bottom: 2px solid transparent
        &:hover
          border-color: $color-primary
        @media (prefers-color-scheme: dark)
          color: $color-light
.update
  font-size: 1rem
  text-align: center
</style>
