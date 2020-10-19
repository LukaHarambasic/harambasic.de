<template>
  <section>
    <ul>
      <nuxt-link
        v-for="item in items"
        :key="item.slug"
        :to="item.path"
        tag="li"
      >
        <h2 class="title" v-text="item.title" />
      </nuxt-link>
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
  align-content: flex-start
  align-items: flex-start
li
  font-size: 1.75rem
  margin: 0 0 2rem 0
  background: $color-secondary
  border-radius: $border-radius
  padding: 1.5rem
  transition: $animation
  &:hover
    cursor: pointer
    transform: scale(1.05)
</style>
