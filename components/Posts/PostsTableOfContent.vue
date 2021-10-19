<template>
  <details class="toc">
    <summary><strong>Table of Content</strong></summary>
    <ol class="nodes">
      <posts-table-of-content-node
        v-for="node in toc"
        :key="node.id"
        :nodes="node"
      />
    </ol>
  </details>
</template>

<script>
export default {
  name: 'PostsTableOfContent',
  props: {
    toc: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
.toc
  color: var(--c-font-on-primary)
  background: var(--c-primary)
  border-radius: $border-radius
  margin: 0 0 2rem 0
  &[open]
    background: var(--c-light)
    summary
      background: var(--c-primary)
      border-radius: $border-radius $border-radius 0 0
  summary
    padding: 1rem 2rem
    border-radius: $border-radius
    &:hover
      cursor: pointer
      strong
        border-color: var(--c-font-on-primary)
    strong
      border-bottom: 2px solid transparent
      font-weight: bold
  .nodes
    padding: 1rem 2rem
</style>
