<template>
  <div class="callout">
    <slot name="prefix" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCallout',
}
</script>

<style lang="sass">
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
  background: var(--c-light)
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
    justify-content: flex-start
  .content
    width: 100%
    a
      color: var(--c-font)
      border-bottom: 2px solid var(--c-primary)
      transition: $animation
      text-decoration: none
      line-height: 1
      &:hover
        text-decoration: none
        border-color: transparent
        background: var(--c-primary)
        color: var(--c-font-on-primary)
  > *
    overflow-wrap: break-word
    // separated over two lines for readability
    &:not(:only-child) // more than one children
      &:first-child // select the slot if it exists as I can't assign a class to a slot
        margin: 0 1rem 0 0
        font-weight: bold
        color: var(--c-font-on-primary)
        background: var(--c-primary)
        border-radius: $border-radius
        padding: .25rem .5rem
        @media screen and (max-width: $breakpoint-mobile)
          margin: 0 0 1rem 0
</style>
