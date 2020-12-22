<template>
  <projects-overview :projects="projects" />
</template>

<script>
import ProjectsOverview from '@/components/Projects/ProjectsOverview'
import getSiteMeta from '@/assets/js/getMeta'
import global from '@/assets/js/global'

export default {
  name: 'Index',
  components: { ProjectsOverview },
  async asyncData({ $content }) {
    return {
      projects: await $content('projects').sortBy('prio', 'desc').fetch(),
    }
  },
  computed: {
    meta() {
      const metaData = {
        // TODO: page title from globals
        title: `Projects - Luka Harambasic`,
        description: 'An overview about some selected projects I did.',
        url: `/projects`,
        img: `/luka_harambasic_projects.png`,
        imgAlt: 'Projects - Luka Harambasic',
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      // TODO: page title from globals
      title: `Projects - Luka Harambasic`,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${global.baseURL}/projects`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
