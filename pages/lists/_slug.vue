<template>
  <lists-details :list="list" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'
import ListsDetails from '@/components/Lists/ListsDetails'

export default {
  components: { ListsDetails },
  async asyncData({ $content, params }) {
    return {
      list: await $content('lists', params.slug).fetch(),
    }
  },
  head() {
    const { title, meta } = generatePageData(
      this.$route.fullPath,
      this.list.title,
      this.list.description,
      '',
      this.$route.params.slug
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
