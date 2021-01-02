<template>
  <div class="grid">
    <cookie />
    <icons-wrapper :inverted="true" class="back" @click.native="back()">
      <icons-back />
    </icons-wrapper>
    <main role="main">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import Cookie from '@/components/Layout/TheLayoutCookie'
import global from 'assets/js/globals'
import IconsWrapper from '@/components/Icons/IconsWrapper'
import IconsBack from '@/components/Icons/IconsBack'

export default {
  components: { IconsBack, IconsWrapper, Cookie },
  methods: {
    back() {
      console.log('BACK')
      this.$router.go(-1)
    },
  },
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
  grid-template-columns: 1fr 1fr 1fr
  grid-template-rows: auto
  grid-template-areas: ". main ."
  padding: 4rem 0
  margin: 0 auto
  background: #F1F1F5
  min-height: 100vh
main
  grid-area: main
.back
  position: absolute
  top: 2rem
  left: 2rem
</style>
