<template>
  <ul class="list">
    <li><strong v-text="preText" /></li>
    <li v-for="item in items" :key="item" v-text="item" />
  </ul>
</template>

<script>
export default {
  name: 'MetaList',
  props: {
    preText: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.list
  opacity: .8
  font-size: .9rem
  line-height: 1
  margin: 0 0 0 0
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
  strong
    text-transform: uppercase
    font-weight: bold
</style>
