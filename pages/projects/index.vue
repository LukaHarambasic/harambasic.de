<template>
  <projects-list :items="projects" />
</template>

<script>
import ProjectsList from '~/components/ProjectsList'
export default {
  name: 'Index',
  components: { ProjectsList },
  async asyncData({ $content }) {
    const projects = await $content('projects').sortBy('prio', 'desc').fetch()
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
