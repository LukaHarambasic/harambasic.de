<template>
  <div class="thanks">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseThanks',
}
</script>

<style lang="sass" scoped>
.thanks
  border-top: 2px solid $color-secondary
  padding: 1rem .5rem 0 .5rem
  margin: 0 0 2rem 0
  font-size: 1rem
  @media (prefers-color-scheme: dark)
    border-top-color: $color-light
</style>
