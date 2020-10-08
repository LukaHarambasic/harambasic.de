<template>
  <Items :items="projects" />
</template>

<script>
import Items from '~/components/Items'
export default {
  name: 'Index',
  components: { Items },
  async asyncData({ $content }) {
    const projects = await $content('projects')
      .only(['title', 'path', 'slug', 'img', 'alt', 'dir'])
      .sortBy('title')
      .fetch()
    return {
      projects,
    }
  },
  head() {
    return {
      title: 'Projects - Luka Harambasic',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'These are my projects.',
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
