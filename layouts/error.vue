<template>
  <section>
    <h2>An error occurred or page not found ({{ error.statusCode }})</h2>
    <div class="nuxt-content">
      <p>
        But why should you care about the error reason? Click on one of the
        links in the navigation or go directly to
        <nuxt-link to="/">home</nuxt-link>. But you won't earn 200€.
      </p>
      <p>
        <a :href="createIssueUrl">Please report this on GitHub.</a> Thanks ❤️
      </p>
    </div>
    <base-footnote>
      Check out the <a :href="globals.blogFeedURL">RSS feed</a> or
      <a :href="globals.twitterURL">my Twitter account</a>
      to keep up to date.
    </base-footnote>
  </section>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  computed: {
    createIssueUrl() {
      console.log(this.$route)
      const base = `https://github.com/LukaHarambasic/harambasic.de/issues/new`
      const title = `title=Page%20not%20found:%20${this.$route.fullPath}`
      const body = `body=The%20following%20page%20is%20currently%20not%20available:%20${this.$route.fullPath}%20(error%20code:%20${this.error.statusCode})`
      return `${base}?${title}&${body}`
    },
  },
}
</script>
