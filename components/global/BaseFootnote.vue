<template>
  <section class="footnote nuxt-content">
    <p>
      <slot />
    </p>
  </section>
</template>

<script>
export default {
  name: 'BaseFootnote',
}
</script>

<style lang="sass" scoped>
.footnote
  margin: 2rem 0 0 0
  font-size: 1rem
  text-align: center
</style>
