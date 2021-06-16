<template>
  <section class="center">
    <div class="profile-content">
      <nuxt-picture
        class="profile"
        src="/profile.jpg"
        alt="That's me: Luka Harambasic"
      ></nuxt-picture>
      <nuxt-content class="markdown" :document="page" />
    </div>
  </section>
</template>

<script>
export default {
  async asyncData({ $content }) {
    return {
      page: await $content('home').fetch(),
    }
  },
}
</script>

<style lang="sass" scoped>
.center
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: center
  align-content: center
  align-items: center
  width: 100%
  height: 100%
.profile-content
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: flex-start
  align-items: flex-start
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
.profile
  flex: 1 0 12rem
  margin: 0 2rem 0 0
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 2rem 0
  &::v-deep
    img
      border-radius: $border-radius
h2
  margin: 0 0 .5rem 0
  line-height: 0.8
  a
    display: none
    width: 0
    height: 0
</style>
