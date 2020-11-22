<template>
  <div class="callout">
    <slot name="prefix" />
    <p class="content">
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  name: 'Callout',
}
</script>

<style lang="sass" scoped>
.callout
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: flex-start
  align-items: flex-start
  padding: 2rem
  margin: 2rem 0
  border-radius: $border-radius
  background: $color-secondary
  color: $color-primary
  .content
    width: 100%
  > *
    // separated over two lines for readability
    &:not(:only-child) // more than one children
      &:first-child // select the slot if it exists as I can't assign a class to a slot
        margin: 0 1rem 0 0
        font-weight: bold
        background: $color-light
        border-radius: $border-radius
        padding: .25rem .5rem
</style>
