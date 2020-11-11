<template>
  <footer>
    <ul>
      <li><nuxt-link to="/imprint">Imprint</nuxt-link></li>
      <li><nuxt-link to="/data-privacy">Data Privacy</nuxt-link></li>
      <li><a href="mailto:hi@harambasic.de">Contact</a></li>
    </ul>
    <logo class="logo" />
  </footer>
</template>

<script>
import Logo from '~/components/Logo'
export default {
  name: 'TheFooter',
  components: { Logo },
}
</script>

<style lang="sass" scoped>
footer
  width: 100%
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: flex-start
  align-items: flex-start
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
    justify-content: center
    align-items: center
    margin: 4rem 0 0 0
  ul
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    @media screen and (max-width: $breakpoint-mobile)
      margin: 0 0 2rem 0
    li
      margin: 0 0 0 1rem
      a
        color: $color-primary
        text-decoration: none
        border-bottom: 2px solid transparent
        transition: $animation
        &:hover
          border-color: $color-primary
  .logo
    width: 3rem
    height: 3rem
    transition: all 600ms ease-in-out
    &:hover
      transform: rotate(1turn)
</style>
