<template>
  <projects-list :items="projects" />
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'
import global from '@/assets/js/global'
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
  computed: {
    meta() {
      const metaData = {
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
