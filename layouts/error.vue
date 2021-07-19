<template>
  <section>
    <h2>An error occurred or page not found</h2>
    <div class="nuxt-content">
      <p>
        But why should you care about the error reason? Click on one of the
        links in the navigation or go directly to
        <nuxt-link to="/">home</nuxt-link>. But you won't earn 200€.
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
}
</script>
