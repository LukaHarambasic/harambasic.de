<template>
  <footer role="contentinfo">
    <ul class="social">
      <li>
        <a rel="me" :href="globals.linkedinURL">Linkedin</a>
      </li>
      <li><a rel="me" :href="globals.githubURL">GitHub</a></li>
      <li>
        <a rel="me" :href="globals.twitterURL">Twitter</a>
      </li>
    </ul>
    <base-logo class="logo" />
    <ul class="legal">
      <li><nuxt-link to="/imprint">Imprint</nuxt-link></li>
      <li><nuxt-link to="/data-privacy">Data Privacy</nuxt-link></li>
      <li><a :href="globals.mailto">Contact</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'TheLayoutFooter',
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
  @media screen and (max-width: $breakpoint-tablet)
    flex-direction: column
    justify-content: center
    align-items: center
    .social
      order: 1
    .legal
      order: 2
    .logo
      order: 3
  ul
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    @media screen and (max-width: $breakpoint-tablet)
      margin: 0 0 1rem 0
    li
      margin: 0 0 0 1rem
      &:first-of-type
        margin: 0
      a
        color: var(--c-font)
        text-decoration: none
        border-bottom: 2px solid transparent
        transition: $animation
        @media screen and (max-width: $breakpoint-mobile)
          font-size: 1rem
        &:hover
          background: var(--c-primary)
          color: var(--c-font-on-primary)
  .logo
    width: 3rem
    height: 3rem
    transition: all 600ms ease-in-out
    &:hover
      transform: rotate(1turn)
</style>
