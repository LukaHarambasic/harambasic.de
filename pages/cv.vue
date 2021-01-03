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
export default {
  name: 'Cv',
  layout: 'cv',
  components: {
    resume,
  },
  data() {
    return {
      segments,
      skills,
      information,
      settings,
    }
  },
}
</script>

<style lang="sass" scoped>
.cv
  border: 1px solid $color-dark
</style>
