<template>
  <div class="callout">
    <slot name="prefix" />
    <slot name="content" />
  </div>
</template>

<script>
export default {
  name: 'Callout',
}
</script>

<style lang="sass" scoped>
.callout
  border-radius: $border-radius
  background: $color-secondary
  color: $color-primary
  padding: 1rem
</style>
