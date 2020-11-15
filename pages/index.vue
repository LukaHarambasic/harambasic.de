<template>
  <section class="center-center nuxt-content">
    <div class="content">
      <h2>Hi! I'm Luka 🧔🏻</h2>
      <p>
        You'll get some insights in
        <nuxt-link to="/projects">Projects</nuxt-link> I did. But I'll also
        share some thoughts, knowledge and experiences in my
        <nuxt-link to="/posts">Blog</nuxt-link>. If you want to see my CV you
        can checkout
        <a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a>. And if
        you still want to know more about me you can also write me a
        <a href="mailto:hi@harambasic.de">Mail</a>.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'Luka Harambasic',
    }
  },
}
</script>

<style lang="sass" scoped></style>
