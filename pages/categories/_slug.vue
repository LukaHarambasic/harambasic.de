<template>
  <section>
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="post in posts" :key="post.slug" class="h-feed">
        <nuxt-link :to="post.path">
          <div class="meta">
            <h2 class="title p-name" v-text="post.title" />
            <time class="date dt-published" :datetime="post.publishedAt">
              <a :href="post.url" class="u-url">
                {{ post.publishedAt | date }}
              </a>
            </time>
          </div>
          <div class="icon">
            <icons-arrow />
          </div>
        </nuxt-link>
      </li>
    </ul>
    <base-footnote>
      Check out the <a :href="globals.blogFeedURL">RSS feed</a> or
      <a :href="globals.twitterURL">my Twitter account</a>
      to keep up to date.
    </base-footnote>
  </section>
</template>

<script>
const getFilteredPosts = (rawPosts, slug) => {
  return rawPosts.filter((post) =>
    post.categories.find((category) => category.slug === slug)
  )
}
const getTitle = (posts, slug) => {
  // Only the slug is available but the title is needed
  const categoryIndex = posts[0].categories.findIndex(
    (category) => category.slug === slug
  )
  return posts[0].categories[categoryIndex].title
}
export default {
  async asyncData({ $content, params }) {
    const rawPosts = await $content('posts')
      .sortBy('publishedAt', 'desc')
      .fetch()
    const posts = getFilteredPosts(rawPosts, params.slug)
    return {
      posts,
      title: getTitle(posts, params.slug),
    }
  },
  // TODO
  // computed: {
  //   meta() {
  //     const metaData = {
  //       type: 'article',
  //       title: this.post.title,
  //       description: this.post.description,
  //       url: `/posts/${this.$route.params.slug}`,
  //       img: `/social/${this.$route.params.slug}.png`,
  //       imgAlt: this.post.title,
  //     }
  //     return getSiteMeta(metaData)
  //   },
  // },
  // head() {
  //   return {
  //     title: `${this.post.title}`,
  //     meta: [
  //       ...this.meta,
  //       {
  //         property: 'article:published_time',
  //         content: this.post.publishedAt,
  //       },
  //       {
  //         property: 'article:modified_time',
  //         content: this.post.updatedAt,
  //       },
  //       { name: 'twitter:label1', content: 'Written by' },
  //       { name: 'twitter:data1', content: this.globals.author || '' },
  //       { name: 'twitter:label2', content: 'Filed under' },
  //     ],
  //   }
  // },
}
</script>

<style lang="sass" scoped>
ul
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: space-between
  align-items: stretch
li
  > a
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: space-between
    align-content: flex-start
    align-items: flex-start
    text-decoration: none
    color: var(--c-font)
    transition: $animation
    border-radius: $border-radius
    padding: 2rem
    &:hover
      background: var(--c-primary)
      .icon
        background: var(--c-surface)
        svg
          fill: var(--c-secondary)
    @media screen and (max-width: $breakpoint-mobile)
      flex-direction: column
      justify-content: flex-start
      align-items: flex-start
    .icon
      display: flex
      flex-direction: row
      flex-wrap: nowrap
      justify-content: center
      align-content: center
      align-items: center
      background: var(--c-primary)
      border-radius: 50%
      font-size: 1.5rem
      line-height: 1.5rem
      padding: .5rem
      margin:  0 0 0 1rem
      transition: $animation
      @media screen and (max-width: $breakpoint-mobile)
        display: none
      svg
        fill: var(--c-font)
        width: 2rem
        height: 2rem
    .title
      font-size: 1.5rem
    .date
      font-size: 1rem
      @media screen and (max-width: $breakpoint-mobile)
        margin: .5rem 0 0 0
      a
        color: var(--c-font)
        text-decoration: none
        transition: $animation
        border-bottom: 2px solid transparent
        &:hover
          border-color: var(--c-font)
</style>
