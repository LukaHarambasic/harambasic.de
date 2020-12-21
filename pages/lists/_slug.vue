<template>
  <list :item="list" />
</template>

<script>
import List from '@/components/List'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  components: { List },
  async asyncData({ $content, params }) {
    const list = await $content('lists', params.slug).fetch()
    return {
      list,
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
