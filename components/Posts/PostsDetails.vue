<template>
  <article class="post h-entry">
    <section>
      <nuxt-img
        class="image"
        :src="post.image"
        :alt="post.alt"
        sizes="xs:200px md:500px lg:1024"
      />
      <header>
        <h1 class="title p-name" v-text="post.title" />
        <div class="row-space-between">
          <base-meta-list class="tags" :items="post.tags" pre-text="Tags:" />
          <time class="date dt-published" :datetime="post.publishedAt">
            <a :href="fullPath" class="u-url">{{ post.publishedAt | date }}</a>
          </time>
        </div>
      </header>
      <base-callout class="tldr p-summary">
        <strong slot="prefix">TL;DR</strong>
        <!-- eslint-disable-next-line vue/no-v-html-->
        <div v-html="post.tldr" />
      </base-callout>
      <nuxt-content class="content e-content" :document="post" />
    </section>
    <section>
      <base-callout class="follow">
        If you have any thoughts or questions feel free to share them in
        <a :href="post.tweet">this thread</a> or send me an
        <a :href="globals.mailto">email</a>. And if you want to stay up to date
        you can subscribe to the <a :href="globals.blogFeedURL">RSS feed</a>.
      </base-callout>
      <div class="author">
        <a :href="globals.baseURL" rel="author" class="p-author h-card"
          >by {{ globals.author }}</a
        >
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'PostsDetails',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fullPath() {
      return `${this.globals.baseURL}${this.post.path}`
    },
  },
}
</script>

<style lang="sass" scoped>
.post
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: stretch
  align-items: stretch
  @media screen and (max-width: $breakpoint-desktop)
    flex-direction: column
.image
  margin: 0 0 2rem 0
  border-radius: $border-radius
  width: 100%
  min-height: 16rem
  @media screen and (max-width: $breakpoint-desktop)
    min-height: 12rem
  @media screen and (max-width: $breakpoint-mobile)
    min-height: 8rem
.title
  font-size: 1.75rem
  line-height: 1.5
  margin: 0 0 1rem 0
.date
  background: $color-secondary
  padding: .25rem .5rem
  border-radius: $border-radius
  font-size: .9rem
  a
    color: $color-primary
    text-decoration: none
    transition: $animation
    border-bottom: 2px solid transparent
    &:hover
      border-color: $color-primary
.tags
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 1rem 0
.author
  width: 100%
  text-align: center
  a
    color: $color-primary
    font-size: .9rem
    text-decoration: none
    transition: $animation
    border-bottom: 2px solid transparent
    &:hover
      border-color: $color-primary
    @media (prefers-color-scheme: dark)
      color: $color-light
      &:hover
        border-color: $color-light
</style>
