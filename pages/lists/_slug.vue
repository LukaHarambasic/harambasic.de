<template>
  <lists-details :list="list" />
</template>

<script>
import ListsDetails from '@/components/Lists/ListsDetails'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  components: { ListsDetails },
  async asyncData({ $content, params }) {
    return {
      list: await $content('lists', params.slug).fetch(),
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article', // TODO What type is a list?
        title: this.list.title,
        description: this.list.description,
        url: `/lists/${this.$route.params.slug}`, // compare with canonical (line 39)
        img: `${this.list.image}`,
        imgAlt: this.list.alt,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      // TODO name from globals
      title: `${this.list.title} - Luka Harambasic`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${global.baseURL}/lists/${this.$route.params.slug}`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
