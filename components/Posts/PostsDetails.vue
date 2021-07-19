<template>
  <article class="post h-entry">
    <section>
      <header>
        <h1 class="title p-name" v-text="post.title" />
        <div class="row-space-between">
          <div class="categories">
            <ul class="links">
              <li v-for="category in post.categories" :key="category.slug">
                <nuxt-link class="link" :to="category.path">
                  {{ category.title }}
                </nuxt-link>
              </li>
            </ul>
          </div>
          <time class="date dt-published" :datetime="post.publishedAt">
            <a :href="post.url" class="u-url">{{ post.publishedAt | date }}</a>
          </time>
        </div>
      </header>
      <base-callout class="tldr p-summary">
        <strong slot="prefix">TL;DR</strong>
        <!-- eslint-disable-next-line vue/no-v-html-->
        <div v-html="post.tldr" />
      </base-callout>
      <posts-table-of-content
        v-if="Array.isArray(post.tocNested)"
        :toc="post.tocNested"
      />
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
        <a :href="post.authorUrl" rel="author" class="p-author h-card">
          by {{ post.author }}
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
  .categories
    .links
      display: flex
      flex-direction: row
      flex-wrap: wrap
      justify-content: flex-start
      align-content: flex-start
      align-items: flex-start
      li
        margin: 0 1rem 0 0
        a
          color: var(--c-font)
          border-bottom: 2px solid var(--c-font)
          transition: $animation
          text-decoration: none
          line-height: 1
          font-size: 1rem
          &:hover
            text-decoration: none
            border-color: var(--c-font-hover)
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
