<template>
  <div class="wrapper">
    <h2>Services</h2>
    <section class="markdown nuxt-content">
      <p>
        I'm a German freelancer based in Copenhagen (Denmark). My main subjects
        are Agile Project Management, New Work Consulting, and Technical
        Partnership. I believe in these topics because I like to empower others
        to do their best. If you are interested in my services, please send me
        an email (<a href="mailto:business@harambasic.de"
          >business@harambasic.de</a
        >) or directly
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
    <!--    <section class="testimonials">-->
    <!--      <services-testimonials />-->
    <!--    </section>-->
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
import ServicesBox from '@/components/Services/ServicesBox'
import getSiteMeta from '@/assets/js/getMeta'
import { logos } from '@/content/services/logos'
import { services } from '@/content/services/services'

export default {
  name: 'Services',
  component: {
    ServicesBox,
    ServicesTestimonials,
  },
  data() {
    return {
      logos,
      services,
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
        title: `Services`,
        description:
          'Hire me for your next project in one of the following areas: Agile Project Management, New Work Consulting, Technical Partnership.',
        url: `/services`,
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
  @media screen and (max-width: $breakpoint-desktop-breakout)
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
    @media screen and (max-width: $breakpoint-mobile)
      gap: 0 // safari mobile isn't able to handle gap...
      flex-direction: column
      justify-content: flex-start
      align-items: center
    li
      @media screen and (max-width: $breakpoint-mobile)
        margin: 0 0 2rem 0 // safari mobile isn't able to handle gap...
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
