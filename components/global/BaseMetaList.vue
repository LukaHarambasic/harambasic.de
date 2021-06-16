<template>
  <ul class="meta-list">
    <li v-for="item in items" :key="item" v-text="item" />
  </ul>
</template>

<script>
export default {
  name: 'BaseMetaList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.meta-list
  font-size: .9rem
  line-height: 1.4
  margin: 0
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: flex-start
  align-content: flex-start
  align-items: flex-start
  li
    margin: 0 .2rem .2rem 0
    list-style: none
    background: $color-secondary
    color: $color-primary
    padding: .2rem .4rem
    border-radius: $border-radius
    &:last-of-type
      margin: 0 .2rem 0 0
</style>
