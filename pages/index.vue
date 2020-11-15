<template>
  <section class="center-center">
    <nuxt-content class="markdown" :document="page" />
  </section>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const page = await $content('home').fetch()
    return {
      page,
    }
  },
}
</script>

<style lang="sass" scoped></style>
