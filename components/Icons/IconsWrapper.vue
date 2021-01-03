<template>
  <div class="icon" :class="{ inverted: 'inverted' }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'IconsWrapper',
  props: {
    inverted: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="sass" scoped>
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
  transition: $animation
  &:hover
    cursor: pointer
  @media (prefers-color-scheme: dark)
    background: $color-primary
  svg
    fill: $color-primary
    width: 2rem
    height: 2rem
    @media (prefers-color-scheme: dark)
      fill: $color-secondary
  &.inverted
    background: $color-primary
    @media (prefers-color-scheme: dark)
      background: $color-secondary
    svg
      fill: $color-secondary
      @media (prefers-color-scheme: dark)
        fill: $color-primary
</style>
