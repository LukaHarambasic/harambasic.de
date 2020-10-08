<template>
  <div class="container">
    <the-header />
    <main>
      <Nuxt />
    </main>
    <the-footer />
  </div>
</template>

<script>
import TheHeader from '~/components/TheHeader'
import TheFooter from '~/components/TheFooter'

export default {
  components: { TheFooter, TheHeader },
}
</script>

<style lang="sass" scoped>
.container
  height: auto
  min-height: 100vh
  width: 64rem
  padding: 4rem 0
  margin: 0 auto
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: space-between
  align-content: flex-start
  align-items: stretch
main
  flex: 1 0 auto
  display: contents
  @supports not (display: contents)
    margin: 4rem 0 0 0
</style>
