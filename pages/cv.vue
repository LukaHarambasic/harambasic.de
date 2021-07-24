<template>
  <client-only>
    <resume
      class="cv"
      :segments="segments"
      :skills="skills"
      :information="information"
      :settings="settings"
    />
  </client-only>
</template>

<script>
import resume from 'vue-resume-component'
import segments from '@/content/cv/segments.json'
import skills from '@/content/cv/skills.json'
import information from '@/content/cv/information.json'
import settings from '@/content/cv/settings.json'
import getSiteMeta from '@/assets/js/getMeta'
export default {
  name: 'Cv',
  components: {
    resume,
  },
  layout: 'cv',
  data() {
    return {
      segments,
      skills,
      information,
      settings,
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
        title: `CV`,
        description: 'My personal CV as a website.',
        url: `/cv`,
        img: `/social/cv.png`,
        imgAlt: `CV - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
