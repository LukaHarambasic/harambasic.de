<template>
  <div class="grid">
    <cookie />
    <icons-wrapper
      :inverted="true"
      :hover="true"
      class="back"
      @click.native="back()"
    >
      <icons-back />
    </icons-wrapper>
    <main role="main">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import global from 'assets/js/globals'
import Cookie from '@/components/Layout/TheLayoutCookie'
import IconsWrapper from '@/components/Icons/IconsWrapper'
import IconsBack from '@/components/Icons/IconsBack'

export default {
  components: { IconsBack, IconsWrapper, Cookie },
  head() {
    const { path } = this.$route
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`
    const canonical = `${global.baseURL}${pathWithSlash}`
    return {
      link: [{ rel: 'canonical', href: canonical }],
    }
  },
  methods: {
    back() {
      if (window.history.length <= 2) {
        this.$router.push('/')
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.grid
  display: grid
  grid-template-columns: 1fr 1fr 1fr
  grid-template-rows: auto
  grid-template-areas: ". main ."
  padding: 4rem 0
  margin: 0 auto
  background: var(--c-primary)
  min-height: 100vh
  @media screen and (max-width: $breakpoint-mobile)
    grid-template-columns: 1fr
    grid-template-areas: "main"
    padding: 2rem
main
  grid-area: main
.back
  position: absolute
  z-index: 500
  top: 2rem
  left: 2rem
  @media screen and (max-width: $breakpoint-mobile)
    top: 1rem
    left: 1rem
</style>
