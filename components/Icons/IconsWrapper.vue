<template>
  <div class="icon" :class="{ inverted, hover }">
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
    hover: {
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
  background: var(--c-primary)
  border-radius: 50%
  font-size: 1.5rem
  line-height: 1.5rem
  padding: .5rem
  transition: $animation
  &:hover
    cursor: pointer
  svg
    fill: var(--c-secondary)
    width: 2rem
    height: 2rem
  &.inverted
    background: var(--c-primary)
    svg
      fill: var(--c-secondary)
  &.hover
    transition: $animation
    transform: scale(1.05)
</style>
