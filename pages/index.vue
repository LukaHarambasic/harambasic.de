<template>
  <section class="center">
    <div class="profile-content">
      <nuxt-picture class="profile" src="/profile.jpg"></nuxt-picture>
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
h2
  margin: 0 0 .25rem 0
</style>
