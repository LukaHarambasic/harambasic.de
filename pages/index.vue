<template>
  <section class="center-center">
    <nuxt-content class="markdown" :document="page" />
  </section>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const page = await $content('home').fetch()
    console.log(page)
    return {
      page,
    }
  },
  head() {
    return {
      title: 'Luka Harambasic',
    }
  },
}
</script>

<style lang="sass" scoped></style>
