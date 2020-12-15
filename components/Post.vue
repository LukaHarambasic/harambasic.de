<template>
  <article class="post h-entry">
    <section>
      <img class="image" :src="item.image" :alt="item.alt" />
      <div class="row-space-between">
        <h1 class="title p-name" v-text="item.title" />
        <time class="date dt-published" :datetime="item.createdAt">
          <a :href="fullPath" class="u-url">{{ item.createdAt | date }}</a>
        </time>
      </div>
      <meta-list class="tags" :items="item.tags" pre-text="Tags:" />
      <callout class="tldr p-summary">
        <strong slot="sprefix">TL;DR</strong>
        {{ item.tldr }}
      </callout>
      <nuxt-content class="content e-content" :document="item" />
    </section>
    <section>
      <callout class="follow">
        Do you have thoughts on this topic? Share them in
        <a :href="item.tweet">this thread</a>. <br />
        You can subscribe to this blog via <a href="/posts/rss.xml">RSS</a> or
        follow me on
        <a href="https://twitter.com/luka_harambasic">Twitter</a> to get the
        latest updates.
        <br />
        And if you find typos fell free to open a
        <a href="https://github.com/LukaHarambasic/harambasic.de/pulls">PR</a>
        (for <a :href="gitHubURL">this file</a>).
      </callout>
      <div class="author">
        <a href="https://harambasic.de" rel="author" class="p-author h-card"
          >by Luka Harambasic</a
        >
      </div>
    </section>
  </article>
</template>

<script>
import MetaList from '@/components/MetaList'
export default {
  name: 'Item',
  components: { MetaList },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fullPath() {
      return `https://harambasic.de${this.item.path}`
    },
    gitHubURL() {
      return `https://github.com/LukaHarambasic/harambasic.de/blob/main/content/posts/${this.item.slug}.md`
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
  background: $color-secondary
  padding: 1rem
  border-radius: $border-radius
  width: 100%
  min-height: 16rem
  @media screen and (max-width: $breakpoint-desktop)
    min-height: 12rem
  @media screen and (max-width: $breakpoint-mobile)
    min-height: 8rem
.title
  font-size: 1.75rem
  line-height: 1.1
  margin: 0 0 .5rem 0
.date
  background: $color-secondary
  padding: .25rem .5rem
  border-radius: $border-radius
  font-size: .9rem
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 .25rem .25rem
  a
    color: $color-primary
    text-decoration: none
    transition: $animation
    border-bottom: 2px solid transparent
    &:hover
      border-color: $color-primary
.tags
  margin: 1rem 0 2rem 0
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
