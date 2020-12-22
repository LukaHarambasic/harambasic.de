<template>
  <lists-overview :lists="lists" />
</template>

<script>
import ListsOverview from '@/components/Lists/ListsOverview'
import global from '@/assets/js/global'
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
      // TODO name form globals
      const metaData = {
        title: `Lists - Luka Harambasic`,
        description: 'TBD', // TODO
        url: `/lists`,
        img: `/luka_harambasic_lists.png`, // TODO create this image
        imgAlt: 'Lists - Luka Harambasic',
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      // TODO name form globals
      title: `Lists - Luka Harambasic`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${global.baseURL}/lists`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
