<template>
  <div class="wrapper-center">
    <div class="center nuxt-content">
      <h2>Hi! I'm Luka 🧔🏻</h2>
      <p>
        You'll get some insights in
        <nuxt-link to="/projects">Projects</nuxt-link> I did. But I'll also
        share some thoughts, knowledge and experiences in my
        <nuxt-link to="/blog">Blog</nuxt-link>. If you want to see my CV you can
        checkout <a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a>.
        And if you still want to know more about me you can also write me a
        <a href="mailto:hi@harambasic.de">mail</a>.
      </p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
.wrapper-center
  flex: 1
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: center
  align-content: center
  align-items: center
  min-height: 100%
</style>
