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
  computed: {
    meta() {
      const metaData = {
        title: `Projects - ${this.globals.title}`,
        description: 'An overview about some selected projects I did.',
        url: `/projects`,
        img: `/luka_harambasic_projects.png`,
        imgAlt: `Projects - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.globals.baseURL}/projects`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
