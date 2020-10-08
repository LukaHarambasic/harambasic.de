<template>
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
</template>

<script>
export default {
  name: 'TheHeader',
}
</script>

<style lang="sass" scoped>
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
</style>
