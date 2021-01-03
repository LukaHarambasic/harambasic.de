<template>
  <lists-details :list="list" />
</template>

<script>
import ListsDetails from '@/components/Lists/ListsDetails'
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
        type: 'article',
        title: this.list.title,
        description: this.list.description,
        url: `/lists/${this.$route.params.slug}`, // compare with canonical (line 39)
        img: this.list.image,
        imgAlt: this.list.title,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: `${this.list.title} - ${this.globals.title}`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.globals.baseURL}/lists/${this.$route.params.slug}`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
