<template>
  <div class="projects">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ToolsList',
}
</script>

<style lang="sass" scoped>
.projects
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: space-between
  align-content: flex-start
  align-items: flex-start
  > *
    margin: 0 0 2rem 0
    &:last-of-type
      margin: 0
</style>
