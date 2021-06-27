<template>
  <lists-overview :lists="lists" />
</template>

<script>
import ListsOverview from '@/components/Lists/ListsOverview'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Index',
  components: { ListsOverview },
  async asyncData({ $content }) {
    return {
      lists: await $content('lists').sortBy('title').fetch(),
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Lists - ${this.globals.title}`,
        description:
          'Lists with content I personally recommend, e.g. development & digital tools.',
        url: `/lists`,
        img: `/social/lists.png`,
        imgAlt: `Lists - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
