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
  margin:  0 0 0 1rem
  transition: $animation
  &:hover
    cursor: pointer
  @media screen and (max-width: $breakpoint-mobile)
    display: none
  svg
    fill: $color-primary
    width: 2rem
    height: 2rem
  &.inverted
    background: $color-primary
    svg
      fill: $color-secondary
</style>
