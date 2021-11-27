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
        <p>
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
          <span class="title">Digital Tool</span>
          <br />
          <span class="subtitle">Consulting</span>
        </h3>
        <p>
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
    <section class="cta">
      <a href="/services/book" class="button">Book an appointment!</a>
    </section>
  </div>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Services',
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
    padding: 2rem
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
    p
      text-align: left
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
