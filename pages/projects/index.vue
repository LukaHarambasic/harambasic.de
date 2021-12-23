<template>
  <projects-overview :projects="projects" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'
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
    const { title, meta } = generatePageData(
      `Projects`,
      'An overview about some selected projects I did.'
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>

<style lang="sass" scoped></style>
