<template>
  <categories-overview :categories="categories" />
</template>

<script>
import { getCategoriesUniq } from 'assets/js/getCategoriesUniq'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Categories',
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('publishedAt', 'desc').fetch()
    return {
      categories: getCategoriesUniq(posts),
    }
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: 'Categories',
        description: `An overview about all the categories I use in page. You won't find this anywhere else in the world wide web.`,
        url: `/categories`,
        img: `/social/categories.png`,
        imgAlt: `Categories - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>
