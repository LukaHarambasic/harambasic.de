<template>
  <projects-overview :projects="projects" />
</template>

<script>
import ProjectsOverview from '@/components/Projects/ProjectsOverview'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Index',
  components: { ProjectsOverview },
  async asyncData({ $content }) {
    return {
      projects: await $content('projects').sortBy('prio', 'desc').fetch(),
    }
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Projects`,
        description: 'An overview about some selected projects I did.',
        url: `/projects`,
        img: `/social/projects.png`,
        imgAlt: `Projects - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
