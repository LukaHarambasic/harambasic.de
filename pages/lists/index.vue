<template>
  <ListsList :items="lists" />
</template>

<script>
import ListsList from '@/components/ListsList'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Index',
  components: { ListsList },
  async asyncData({ $content }) {
    const lists = await $content('lists').sortBy('title').fetch()
    return {
      lists,
    }
  },
  computed: {
    meta() {
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
