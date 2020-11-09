<template>
  <section class="box nuxt-content">
    <h2>Hi! I'm Luka 🧔🏻</h2>
    <p>
      You'll get some insights in
      <nuxt-link to="/projects">Projects</nuxt-link> I did.
      <span class="strike-through">
        But I'll also share some thoughts, knowledge and experiences in my
        <nuxt-link to="/posts">Blog</nuxt-link>.</span
      >
      If you want to see my CV you can checkout
      <a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a>. And if you
      still want to know more about me you can also write me a
      <a href="mailto:hi@harambasic.de">Mail</a>.
    </p>
  </section>
</template>

<script>
export default {
  layout: 'home',
  head() {
    return {
      title: 'Luka Harambasic',
    }
  },
}
</script>

<style lang="sass" scoped>
.box
  margin: 0 auto
  @media screen and (max-width: $breakpoint-mobile)
    width: 100%
.strike-through
  text-decoration: line-through
</style>
