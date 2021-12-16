<template>
  <div class="wrapper">
    <h2>Services</h2>
    <section class="markdown nuxt-content">
      <p>
        I'm a german freelancer based in Copenhagen (Denmark). My main subjects
        are Agile Project Management, New Work Consulting, and Technical
        Partnership. If you are interested in my services, please send me an
        email (<a href="mailto:hi@harambasic.de">hi@harambasic.de</a>) or
        directly
        <a href="/services/book" class="button">schedule an appointment</a>.
      </p>
    </section>
    <section class="services">
      <services-box
        v-for="(service, index) in services"
        :key="index"
        :title="service.title"
        :icon="service.icon"
        :description="service.description"
      />
    </section>
    <section class="testimonials">
      <services-testimonials />
    </section>
    <section class="cta">
      <a href="/services/book" class="button">Schedule an appointment</a>
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
import ServicesTestimonials from '@/components/Services/ServicesTestimonials'
import getSiteMeta from '@/assets/js/getMeta'
import { logos } from '@/content/services/logos'

export default {
  name: 'Services',
  component: {
    ServicesTestimonials,
  },
  data() {
    return {
      logos,
      services: [
        {
          title: 'Agile Project<br />Management',
          icon: 'Agile',
          description:
            'Software teams need team leads with technical and deep methodically knowledge, like Scrum and Kanban. Therefore, I can take on the role of a Scrum Master and Product Owner to build bridges between business, IT, and external stakeholders.',
        },
        {
          title: 'New Work<br />Consulting',
          icon: 'Tool',
          description:
            'Digital Transformations are happening everywhere, which changes how organizations function, teams communicate, and individuals work. These restructurings lead to process optimization and automation. I uncover the potential with Design thinking Workshops.',
        },
        {
          title: 'Technical<br />Partnership',
          icon: 'Tech',
          description:
            'New concepts sometimes need help to realize them. If the industry knowledge exists but lacks the technical expertise, external support is required. To answer questions about the architecture, technologies, platforms, and whom to hire.',
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
    width: 100%
    left: unset
    flex-direction: column
.tools
  background: var(--c-light-stable)
  padding: 3rem
  border-radius: var(--border-radius)
  ul
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: center
    align-content: flex-start
    align-items: flex-start
    gap: 2rem
    margin: 0 0 1rem 0
    color: var(--c-font-stable)
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
    @media screen and (max-width: $breakpoint-mobile)
      font-size: 1rem
      padding: 1rem 1.5rem
</style>
