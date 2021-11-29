<template>
  <div class="wrapper">
    <section>
      <h2>Services</h2>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </section>
    <section class="services">
      <div class="service">
        <icons-agile class="icon" />
        <h3 class="header">
          <span class="title">Agile Project</span>
          <br />
          <span class="subtitle">Consulting</span>
        </h3>
        <p class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
      <div class="service">
        <icons-tool class="icon" />
        <h3 class="header">
          <span class="title">New Work</span>
          <br />
          <span class="subtitle">Consulting</span>
        </h3>
        <p class="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
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
    <section class="cta">
      <a href="/services/book" class="button">Book an appointment!</a>
    </section>
  </div>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Services',
  data() {
    return {
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
  .service
    text-align: center
    background: var(--c-light)
    padding: 4rem
    border-radius: var(--border-radius)
    &:first-of-type
      margin: 0 4rem 0 0
      @media screen and (max-width: $breakpoint-desktop)
        margin: 0 0 4rem 0
    .icon
      margin: 0 0 1rem 0
      &::v-deep
        width: 8rem
        height: 8rem
    .header
      margin: 0 0 2rem
      .title
        font-size: 1.5rem
        line-height: 1.4
      .subtitle
        display: inline
        font-size: 1rem
        background: var(--c-primary)
        color: var(--c-font-on-primary)
        padding: .25rem .5rem
        font-weight: normal
        border: 2rem
    .description
      text-align: left
      //border-bottom: 1px solid var(--c-surface)
      //padding: 0 0 2rem 0
      //margin: 0 0 2rem 0
.tools
  ul
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: center
    align-content: flex-start
    align-items: flex-start
    gap: 2rem
    margin: 0 0 2rem 0
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
