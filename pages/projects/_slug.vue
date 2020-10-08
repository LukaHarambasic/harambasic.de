<template>
  <item :item="project" />
</template>

<script>
import Item from '~/components/Item'
export default {
  components: { Item },
  async asyncData({ $content, params }) {
    const project = await $content('projects', params.slug).fetch()
    return {
      project,
    }
  },
  head() {
    return {
      title: this.project.title + '- Luka Harambasic',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.project.desc,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
