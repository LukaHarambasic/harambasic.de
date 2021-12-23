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
  head() {
    const { content } = this.meta.find((item) => item.hid === 'og:title')
    return {
      title: content,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Lists`,
        description:
          'Lists with content I personally recommend, e.g. development & digital tools.',
        url: `/lists`,
        img: `/social/lists.png`,
        imgAlt: `Lists - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
