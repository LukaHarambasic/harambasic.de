<template>
  <section>
    <ul>
      <li>
        <nuxt-link v-for="item in items" :key="item.slug" :to="item.path">
          <h2 class="title" v-text="item.title" />
          <time class="date">{{ item.createdAt | date }}</time>
        </nuxt-link>
      </li>
    </ul>
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
  a
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: space-between
    align-content: stretch
    align-items: center
    margin: 0 0 2rem 0
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
    .title
      font-size: 1.5rem
    .date
      @media screen and (max-width: $breakpoint-mobile)
        margin: .5rem 0 0 0
</style>
