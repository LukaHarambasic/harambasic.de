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
      <details class="toc">
        <summary><strong>Table of Content</strong></summary>
        <ul>
          <li
            v-for="entry in post.toc"
            :key="entry.id"
            :data-depth="entry.depth"
          >
            <a :href="getAnchor(entry.id)">{{ entry.text }}</a>
          </li>
        </ul>
      </details>
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
  methods: {
    getAnchor(id) {
      return `#${id}`
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
  .toc
    color: var(--c-font)
    background: var(--c-primary)
    border-radius: $border-radius
    margin: 0 0 2rem 0
    &[open]
      background: var(--c-primary-light)
      summary
        background: var(--c-primary)
        border-radius: $border-radius $border-radius 0 0
    summary
      padding: 1rem 2rem
      border-radius: $border-radius
      &:hover
        cursor: pointer
        strong
          border-color: var(--c-font)
      strong
        border-bottom: 2px solid transparent
        font-weight: bold
    ul
      padding: 1rem 2rem
      margin: 0 0 0 0.5rem
      li
        margin: 0 0 0.25rem 0
        $depth-space: 1rem
        &[data-depth="2"]
          margin-left: 0 * $depth-space
        &[data-depth="3"]
          margin-left: 1 * $depth-space
        &[data-depth="4"]
          margin-left: 2 * $depth-space
        &[data-depth="5"]
          margin-left: 3 * $depth-space
        &[data-depth="6"]
          margin-left: 4 * $depth-space
        a
          color: var(--c-font)
          transition: $animation
          text-decoration: none
          line-height: 1
          border-bottom: 2px solid transparent
          &:hover
            border-color: var(--c-font)
          &:before
            content: '» '
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
