<template>
  <lists-overview :lists="lists" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'
import ListsOverview from '@/components/Lists/ListsOverview'

export default {
  name: 'Index',
  components: { ListsOverview },
  async asyncData({ $content }) {
    return {
      lists: await $content('lists').sortBy('title').fetch(),
    }
  },
  head() {
    const { title, meta } = generatePageData(
      `Lists`,
      'Lists with content I personally recommend, e.g. development & digital tools.'
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
