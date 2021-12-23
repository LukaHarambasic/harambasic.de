<template>
  <lists-details :list="list" />
</template>

<script>
import getSiteMeta from 'assets/js/pageData'
import ListsDetails from '@/components/Lists/ListsDetails'

export default {
  components: { ListsDetails },
  async asyncData({ $content, params }) {
    return {
      list: await $content('lists', params.slug).fetch(),
    }
  },
  head() {
    return {
      title: `${this.list.title}`,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: this.list.title,
        description: this.list.description,
        url: `/lists/${this.$route.params.slug}`, // compare with canonical (line 39)
        img: `/social/${this.$route.params.slug}.png`,
        imgAlt: this.list.title,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
