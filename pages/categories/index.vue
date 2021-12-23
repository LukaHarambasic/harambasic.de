<template>
  <categories-overview :categories="categories" />
</template>

<script>
import { getCategoriesUniq } from 'assets/js/getCategoriesUniq'
import { generatePageData } from '@/assets/js/pageData'

export default {
  name: 'Categories',
  async asyncData({ $content }) {
    const posts = await $content('posts').sortBy('publishedAt', 'desc').fetch()
    return {
      categories: getCategoriesUniq(posts),
    }
  },
  head() {
    const { title, meta } = generatePageData(
      `Categories`,
      `An overview about all the categories I use in page. You won't find this anywhere else in the world wide web.`
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>
