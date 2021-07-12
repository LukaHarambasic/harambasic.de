<template>
  <li>
    <a :href="getAnchor(nodes.id)">{{ nodes.text }}</a>
    <ul v-if="nodes.children.length !== 0">
      <posts-table-of-content-node
        v-for="node in nodes.children"
        :key="node.id"
        :nodes="node"
      />
    </ul>
  </li>
</template>

<script>
export default {
  name: 'PostsTableOfContentNode',
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getAnchor(id) {
      return `#${id}`
    },
  },
}
</script>

<style lang="sass" scoped>
ul
  margin: 0 0 0 1rem
  li
    margin: 0 0 0.25rem 0
    a
      color: var(--c-font)
      transition: $animation
      text-decoration: none
      line-height: 1
      border-bottom: 2px solid transparent
      &:hover
        border-color: var(--c-font)
      &:before
        content: '» '
</style>
