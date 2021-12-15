<template>
  <div class="wrapper">
    <section>
      <h2>Services</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </section>
    <section class="services">
      <services-box
        v-for="(service, index) in services"
        :key="index"
        :title="service.title"
        :subtitle="service.subtitle"
        :icon="service.icon"
        :description="service.description"
      />
    </section>
    <section class="cta">
      <a href="/services/book" class="button">Book an appointment!</a>
    </section>
    <section class="tools">
      <ul>
        <li v-for="logo in logos" :key="logo.path">
          <a :href="logo.url">
            <nuxt-picture
              :src="logo.path"
              :alt="logo.alt"
              sizes="xs:200px md:500px"
            />
          </a>
        </li>
      </ul>

      <p class="disclaimer">I'm not affiliated with any of the companies.</p>
    </section>
  </div>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'
import { logos } from '@/content/services/logos'

export default {
  name: 'Services',
  data() {
    return {
      logos,
      services: [
        {
          title: 'Agile Project',
          subtitle: 'Management',
          icon: 'Agile',
          description:
            'Morem ipsum dolor sit amet, consectetur adipiscing ecit, sed do\n' +
            ' riusmod tempor incididunt ut labore et dolore magna alrqua. Ut enim ad\n' +
            ' tinim veniam, quis nostrud exercitation ullamco laboris nisi ut\n' +
            ' gliquip ex ea commodo consequat. Duis aute irure drlor in\n' +
            ' geprehenderit in voluptate velit esse cillum dclrre eu fugiat nulla\n' +
            ' oariatur. Excepteur sint occaecat cupidatat non prlident, sunt in\n' +
            ' aulpa qui officia deserunt mollit anim id est laboeum.',
        },
        {
          title: 'New Work',
          subtitle: 'Consulting',
          icon: 'Tool',
          description:
            'Loreem ipsum dolor sit amet, consectetur adipiescing elit, sed do\n' +
            ' eiuesmod tempor incididunt ut labore et doqlore magna aliqua. Ut enim ad\n' +
            ' minrim veniam, quis nostrud exerciwtation ullamco laboris nisi ut\n' +
            ' alitquip ex ea commodo consequeat. Duis aute irure dolor in\n' +
            ' reprtehenderit in voluptate veelit esse cillum dolore eu fugiat nulla\n' +
            ' pariqatur. Excepteur sint occaercat cupidatat non proident, sunt in\n' +
            ' culwpa qui officia deserunt mollit anim idt est laborum.',
        },
        {
          title: 'Technical',
          subtitle: 'Partner',
          icon: 'Tool',
          description:
            'Lorem ipsurm dolor sit amet, consectetur adipiscing elit, sed do\n' +
            ' eiusmod tempor incididunt ut larbore et dolore magna aliqua. Ut enim ad\n' +
            ' minim veniam, quis nostrud exerwcitation ullamco laboris nisi ut\n' +
            ' aliquip ex ea commodo consewwquat. Duis aute iruqwre dolor in\n' +
            ' reprechenderit in voluptate velit esse cillum doflore eu fugiat nulla\n' +
            ' pariatur. Excepteur sint occabecat cupidatat non pgroident, sunt in\n' +
            ' culpa qui officia deserunt mollbit anim id est labonrum.',
        },
      ],
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
        title: `Services`,
        img: `/social/services.png`,
        imgAlt: `Services - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped>
section
  margin: 0 0 6rem 0
.services
  width: $size-desktop-breakout
  position: relative
  left: calc(calc($size-desktop-breakout / -2) + 50%)
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: stretch
  align-items: stretch
  @media screen and (max-width: $breakpoint-desktop)
    flex-direction: column
.tools
  ul
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: center
    align-content: flex-start
    align-items: flex-start
    gap: 2rem
    margin: 0 0 1rem 0
    li
      a
        filter: grayscale(100%)
        transition: var(--transition)
        &:hover
          filter: grayscale(0)
  .disclaimer
    font-size: 0.9rem
    opacity: 0.9
    text-align: center
.cta
  text-align: center
  .button
    background: var(--c-primary)
    color: var(--c-font-on-primary)
    padding: 1.5rem 2rem
    transition: $animation
    border-radius: var(--border-radius)
    text-decoration: none
    font-size: 1.2rem
    font-weight: bold
    &:hover
      color: var(--c-primary)
      background: var(--c-font-on-primary)
</style>
