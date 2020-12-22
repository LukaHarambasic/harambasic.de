<template>
  <header role="banner">
    <h1>
      <nuxt-link to="/">{{ globals.title }}</nuxt-link>
    </h1>
    <nav role="navigation">
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/projects">Projects</nuxt-link></li>
        <li><nuxt-link to="/lists">Lists</nuxt-link></li>
        <li><nuxt-link to="/posts">Blog</nuxt-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'TheLayoutHeader',
}
</script>

<style lang="sass" scoped>
header
  width: 100%
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: center
  align-items: center
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
    justify-content: center
h1
  font-size: 1.75rem
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 2rem 0
  a
    color: $color-primary
    text-decoration: none
    border-bottom: 2px solid transparent
    transition: $animation
    line-height: 1
    &:hover
      border-color: $color-primary
    @media (prefers-color-scheme: dark)
      color: $color-light
      &:hover
        border-color: $color-light
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
      &:first-of-type
        margin: 0
      a
        color: $color-primary
        text-decoration: none
        border-bottom: 2px solid transparent
        transition: $animation
        &.nuxt-link-exact-active
          border-color: $color-primary
          &:hover
            border-color: rgba($color-primary, .3)
        &:hover
          border-color: $color-primary
        @media (prefers-color-scheme: dark)
          color: $color-light
          &.nuxt-link-exact-active
            border-color: $color-light
            &:hover
              border-color: rgba($color-light, .3)
          &:hover
            border-color: $color-light
</style>
