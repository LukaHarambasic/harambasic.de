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

export default {
  name: 'Services',
  data() {
    return {
      services: [
        {
          title: 'Agile Project',
          subtitle: 'Management',
          icon: 'Agile',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\n' +
            ' eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\n' +
            ' minim veniam, quis nostrud exercitation ullamco laboris nisi ut\n' +
            ' aliquip ex ea commodo consequat. Duis aute irure dolor in\n' +
            ' reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\n' +
            ' pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n' +
            ' culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          title: 'New Work',
          subtitle: 'Consulting',
          icon: 'Tool',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\n' +
            ' eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\n' +
            ' minim veniam, quis nostrud exercitation ullamco laboris nisi ut\n' +
            ' aliquip ex ea commodo consequat. Duis aute irure dolor in\n' +
            ' reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\n' +
            ' pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n' +
            ' culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          title: 'Technical',
          subtitle: 'Partner',
          icon: 'Tool',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do\n' +
            ' eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad\n' +
            ' minim veniam, quis nostrud exercitation ullamco laboris nisi ut\n' +
            ' aliquip ex ea commodo consequat. Duis aute irure dolor in\n' +
            ' reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\n' +
            ' pariatur. Excepteur sint occaecat cupidatat non proident, sunt in\n' +
            ' culpa qui officia deserunt mollit anim id est laborum.',
        },
      ],
      logos: [
        {
          path: '/services/airtable.svg',
          alt: 'Airtable Logo',
          url: 'https://airtable.com/',
        },
        {
          path: '/services/asana.svg',
          alt: 'Asana Logo',
          url: 'https://asana.com/de',
        },
        {
          path: '/services/buffer.svg',
          alt: 'Buffer Logo',
          url: 'https://buffer.com/',
        },
        {
          path: '/services/copper.svg',
          alt: 'Copper Logo',
          url: 'https://www.copper.com/',
        },
        {
          path: '/services/google_workspace.svg',
          alt: 'Google Workspace Logo',
          url: 'https://workspace.google.com/',
        },
        {
          path: '/services/hubspot.svg',
          alt: 'Hubspot Logo',
          url: 'https://www.hubspot.com/',
        },
        {
          path: '/services/jira.svg',
          alt: 'Jira Software Logo',
          url: 'https://www.atlassian.com/software/jira',
        },
        {
          path: '/services/mailchimp.svg',
          alt: 'Mailchimp Logo',
          url: 'https://mailchimp.com/',
        },
        {
          path: '/services/microsoft_365.svg',
          alt: 'Microsoft 365 Logo',
          url: 'https://www.microsoft.com/en-us/microsoft-365',
        },
        {
          path: '/services/miro.svg',
          alt: 'Miro Logo',
          url: 'https://miro.com/',
        },
        {
          path: '/services/mural.svg',
          alt: 'Mural Logo',
          url: 'https://www.mural.co/',
        },
        {
          path: '/services/nextcloud.svg',
          alt: 'NextCloud Logo',
          url: 'https://nextcloud.com/',
        },
        {
          path: '/services/notion.svg',
          alt: 'Notion Logo',
          url: 'https://www.notion.so/',
        },
        {
          path: '/services/slab.svg',
          alt: 'Slab Logo',
          url: 'https://slab.com/',
        },
        {
          path: '/services/slack.svg',
          alt: 'Slack Logo',
          url: 'https://slack.com/',
        },
        {
          path: '/services/todoist.svg',
          alt: 'todoist Logo',
          url: 'https://todoist.com/',
        },
        {
          path: '/services/toggl.svg',
          alt: 'Toggl Logo',
          url: 'https://toggl.com/',
        },
        {
          path: '/services/typeform.svg',
          alt: 'Typeform Logo',
          url: 'https://www.typeform.com/',
        },
        {
          path: '/services/zapier.svg',
          alt: 'Zapier Logo',
          url: 'https://zapier.com/',
        },
        {
          path: '/services/zoom.svg',
          alt: 'Zoom Logo',
          url: 'https://zoom.us/',
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
