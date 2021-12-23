<template>
  <projects-overview :projects="projects" />
</template>

<script>
import getSiteMeta from 'assets/js/pageData'
import ProjectsOverview from '@/components/Projects/ProjectsOverview'

export default {
  name: 'Index',
  components: { ProjectsOverview },
  async asyncData({ $content }) {
    return {
      projects: await $content('projects').sortBy('prio', 'desc').fetch(),
    }
  },
  head() {
    const { content } = this.meta.find((item) => item.hid === 'og:title')
    return {
      title: content,
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
