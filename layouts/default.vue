<template>
  <div class="grid">
    <cookie />
    <the-header class="header" />
    <main>
      <Nuxt />
    </main>
    <the-footer class="footer" />
  </div>
</template>

<script>
import Cookie from '@/components/Cookie'
import TheHeader from '~/components/TheHeader'
import TheFooter from '~/components/TheFooter'

export default {
  components: { Cookie, TheFooter, TheHeader },
}
</script>

<style lang="sass" scoped>
.grid
  display: grid
  grid-template-columns: 1fr $size-desktop-content 1fr
  grid-template-rows: auto 1fr auto
  grid-template-areas: "header header header" ". main ." "footer footer footer"
  row-gap: 4rem
  height: auto
  min-height: 100vh
  width: $size-desktop
  padding: 4rem 0
  margin: 0 auto
  @media screen and (max-width: $breakpoint-desktop)
    width: $size-mobile
    grid-template-columns: 1fr
    grid-template-rows: auto 1fr auto
    grid-template-areas: "header" "main" "footer"
main
  grid-area: main
.footer
  grid-area: footer
.header
  grid-area: header
</style>
