<template>
  <div class="grid">
    <cookie />
    <the-header class="header" />
    <main role="main">
      <Nuxt />
    </main>
    <the-footer class="footer" />
  </div>
</template>

<script>
import Cookie from '@/components/Layout/TheLayoutCookie'
import global from 'assets/js/globals'
import TheHeader from '@/components/Layout/TheLayoutHeader'
import TheFooter from '@/components/Layout/TheLayoutFooter'

export default {
  components: { Cookie, TheFooter, TheHeader },
  head() {
    const { path } = this.$route
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`
    const canonical = `${global.baseURL}${pathWithSlash}`
    return {
      link: [{ rel: 'canonical', href: canonical }],
    }
  },
}
</script>

<style lang="sass" scoped>
.grid
  display: grid
  grid-template-columns: 1fr $size-desktop-content 1fr
  grid-template-rows: auto 1fr auto
  grid-template-areas: ". header ." "main main main" ". footer ."
  row-gap: 4rem
  height: auto
  min-height: 100vh
  padding: 4rem 0
  margin: 0 auto
  @media screen and (max-width: $breakpoint-desktop)
    width: $size-mobile
    grid-template-columns: minmax(0, 1fr)
    grid-template-rows: auto 1fr auto
    grid-template-areas: "header" "main" "footer"
main
  grid-area: main
.footer
  grid-area: footer
.header
  grid-area: header
</style>
