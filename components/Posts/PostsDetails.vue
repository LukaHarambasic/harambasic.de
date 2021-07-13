<template>
  <article class="post h-entry">
    <section>
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
      <posts-table-of-content :toc="post.tocNested" />
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
        <a :href="authorURL" rel="author" class="p-author h-card">
          by {{ author }}
        </a>
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
    author() {
      return this.post.author || this.globals.author
    },
    authorURL() {
      return this.post.authorURL || this.globals.baseURL
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
  .title
    font-size: 1.75rem
    line-height: 1.5
    margin: 0 0 1rem 0
  .date
    background: var(--c-primary)
    padding: .25rem .5rem
    border-radius: $border-radius
    font-size: .9rem
    a
      color: var(--c-font)
      text-decoration: none
      transition: $animation
      border-bottom: 2px solid transparent
      &:hover
        border-color: var(--c-font)
  .tags
    @media screen and (max-width: $breakpoint-mobile)
      margin: 0 0 1rem 0
  .author
    width: 100%
    text-align: center
    a
      color: var(--c-font)
      font-size: .9rem
      text-decoration: none
      transition: $animation
      border-bottom: 2px solid transparent
      &:hover
        border-color: var(--c-font)
</style>
