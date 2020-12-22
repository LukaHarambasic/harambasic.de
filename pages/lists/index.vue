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
        description: 'TBD', // TODO
        url: `/lists`,
        img: `/luka_harambasic_lists.png`, // TODO create this image
        imgAlt: `Lists - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.globals.baseURL}/lists`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
