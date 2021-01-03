<template>
  <section>
    <ul>
      <li v-for="list in lists" :key="list.slug" class="h-feed">
        <nuxt-link :to="list.path">
          <div>
            <h2 class="title p-name" v-text="list.title" />
            <p v-text="list.description" />
          </div>
          <div class="icon">
            <icons-arrow />
          </div>
        </nuxt-link>
      </li>
    </ul>
    <!-- TODO add lists feed if wanted-->
    <base-footnote>
      Check out
      <a :href="globals.twitterURL">my Twitter account</a>
      to keep up to date.
    </base-footnote>
  </section>
</template>

<script>
import IconsArrow from '@/components/Icons/IconsArrow'

export default {
  name: 'ListsOverview',
  components: { IconsArrow },
  props: {
    lists: {
      type: Array,
      required: true,
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
      margin:  0 0 0 2rem
      transition: $animation
      @media screen and (max-width: $breakpoint-mobile)
        display: none
      svg
        fill: $color-primary
        width: 2rem
        height: 2rem
    .title
      font-size: 1.5rem
</style>
