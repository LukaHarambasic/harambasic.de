<template>
  <header role="banner">
    <nuxt-link class="title" to="/">{{ globals.title }}</nuxt-link>
    <nav role="navigation">
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
        <li><nuxt-link to="/projects">Projects</nuxt-link></li>
        <li><nuxt-link to="/lists">Lists</nuxt-link></li>
        <li><nuxt-link to="/posts">Blog</nuxt-link></li>
        <li>
          <a href="https://harambasic.de/Luka_Harambasic.pdf">CV</a>
        </li>
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
.title
  font-size: 1.75rem
  font-weight: bold
  color: var(--c-font)
  text-decoration: none
  border-bottom: 2px solid transparent
  transition: $animation
  line-height: 1
  margin: 0 2rem 0 0
  &:hover
    background: var(--c-primary)
    color: var(--c-font-on-primary)
  @media screen and (max-width: $breakpoint-mobile)
    text-align: center
    margin: 0 0 2rem 0
nav
  ul
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    @media screen and (max-width: $breakpoint-mobile)
      flex-wrap: wrap
      justify-content: center
      align-content: center
      align-items: center
    li
      margin: 0 1rem 0 0
      &:last-of-type
        margin: 0
      a
        color: var(--c-font)
        text-decoration: none
        border-bottom: 2px solid transparent
        transition: $animation
        &.nuxt-link-exact-active
          border-color: var(--c-primary)
          &:hover
            border-color: transparent
        &:hover
          border-color:  var(--c-primary)
        .ri-external-link-fill
          margin: .25rem 0 0 .25rem
</style>
