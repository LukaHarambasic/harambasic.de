<template>
  <div class="container">
    <header>
      <h1><nuxt-link to="/">Luka Harambasic</nuxt-link></h1>
      <nav>
        <ul>
          <li><nuxt-link to="/">Home</nuxt-link></li>
          <li><nuxt-link to="/projects">Projects</nuxt-link></li>
          <li><nuxt-link to="/posts">Blog</nuxt-link></li>
        </ul>
      </nav>
    </header>
    <main>
      <Nuxt />
    </main>
    <footer>
      <ul>
        <li><nuxt-link to="/imprint">Imprint</nuxt-link></li>
        <li><nuxt-link to="/data-privacy">Data Privacy</nuxt-link></li>
        <li><a href="mailto:hi@harambasic.de">Contact</a></li>
      </ul>
      <logo class="logo" />
    </footer>
  </div>
</template>

<script>
import Logo from '~/components/Logo'
export default {
  components: { Logo },
}
</script>

<style lang="sass">
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
header
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: center
  align-items: center
  margin: 0 0 4rem 0
  h1
    font-size: 1.75rem
    a
      color: $color-primary
      text-decoration: none
      border-bottom: 2px solid transparent
      transition: $animation
      &:hover
        border-color: $color-primary
  nav
    ul
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      justify-content: flex-start
      align-content: flex-start
      align-items: flex-start
      li
        margin: 0 0 0 1rem
        a
          color: $color-primary
          text-decoration: none
          border-bottom: 2px solid transparent
          transition: $animation
          &:hover
            border-color: $color-primary
main
  flex: 1 0 auto
  display: contents
  @supports not (display: contents)
    margin: 4rem 0 0 0
footer
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: center
  align-items: center
  .logo
    width: 3rem
    height: 3rem
  ul
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    li
      margin: 0 0 0 1rem
      a
        color: $color-primary
        text-decoration: none
        border-bottom: 2px solid transparent
        transition: $animation
        &:hover
          border-color: $color-primary
</style>
