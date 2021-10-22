<template>
  <section>
    <h2>Projects</h2>
    <ul class="filters">
      <li v-for="filter in filters" :key="filter.id">
        <button @click="onFilter(filter.id)">
          <div class="status" :data-status="filter.id"></div>
          {{ filter.value }}
        </button>
      </li>
    </ul>
    <ul class="projects">
      <li
        v-for="project in filteredProjects"
        :key="project.slug"
        class="project"
      >
        <div class="status" :data-status="project.status"></div>
        <div class="meta">
          <nuxt-picture
            :src="fullImagePath(project.img)"
            :alt="project.alt"
            sizes="xs:200px md:500px"
          />
        </div>
        <div class="content">
          <h2 class="title" v-text="project.title" />
          <base-meta-list
            :items="project.responsibilities"
            pre-text="Responsibilities:"
          />
          <nuxt-content class="description stable-color" :document="project" />
          <ul class="links">
            <li v-for="link in project.links" :key="link.title">
              <a class="link" :href="link.url" v-text="link.title" />
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div v-if="filteredProjects.length === 0" class="nothing-found">
      Sorry, there isn't a project with the selected filter :(
    </div>
    <base-footnote>
      If you want to learn more about the projects, please do not hesitate to
      send me an
      <a :href="globals.mailto">email</a>.
    </base-footnote>
  </section>
</template>

<script>
const FILTERS = {
  DEFAULT: {
    id: 0,
    value: 'all',
  },
  // TODO technically it's a sort not a filter
  AZ: {
    id: 3,
    value: 'a-z',
  },
  // TODO technically it's a sort not a filter
  ZA: {
    id: 4,
    value: 'z-a',
  },
  ACTIVE: {
    id: 1,
    value: 'active',
  },
  // INACTIVE: {
  //   id: 2,
  //   value: 'inactive',
  // },
}

const sortTitleAZ = (a, b) => {
  if (a.title < b.title) return -1
  if (a.title > b.title) return 1
  return 0
}

const sortTitleZA = (a, b) => {
  if (a.title < b.title) return 1
  if (a.title > b.title) return -1
  return 0
}

const filterActive = (a) => a.status === FILTERS.ACTIVE.id
// const filterInactive = (a) => a.status === FILTERS.INACTIVE.id

export default {
  name: 'ProjectsList',
  props: {
    projects: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filters: FILTERS,
      selectedFilter: 0,
    }
  },
  computed: {
    filteredProjects() {
      const projects = JSON.parse(JSON.stringify(this.projects))
      switch (this.selectedFilter) {
        case FILTERS.ACTIVE.id:
          return projects.filter(filterActive)
        // case FILTERS.INACTIVE.id:
        //   return projects.filter(filterInactive)
        case FILTERS.AZ.id:
          return projects.sort(sortTitleAZ)
        case FILTERS.ZA.id:
          return projects.sort(sortTitleZA)
        default:
          return projects
      }
    },
  },
  methods: {
    fullImagePath(img) {
      return `/projects/${img}`
    },
    onFilter(id) {
      this.selectedFilter = id
    },
  },
}
</script>

<style lang="sass" scoped>
.status
  border-radius: 100%
  display: none
  &[data-status='1'], &[data-status='2']
    display: block
  &[data-status='1'] // active
    background: var(--c-success)
  &[data-status='2'] // inactive
    background: transparent // var(--c-warning)
.filters
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-end
  margin: 0 0 2rem 0
  button
    color: var(--c-font)
    background: none
    border: none
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    font-size: 1rem
    padding: 0.05rem 0.1rem
    margin: 0 0.5rem
    transition: $animation
    border-bottom: 2px solid var(--c-primary)
    &:hover
      cursor: pointer
      color: var(--c-light)
      border-color: transparent
      background: var(--c-primary)
    .status
      height: 1rem
      width: 1rem
      margin: 0 .2rem 0 0
.projects
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: flex-start
  align-items: flex-start
.project
  position: relative
  margin: 0 0 4rem 0
  background: var(--c-light)
  border-radius: $border-radius
  padding: 2rem
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: space-between
  align-content: stretch
  align-items: flex-start
  transition: $animation
  &:last-of-type
    margin: 0
  @media screen and (max-width: $breakpoint-mobile)
    flex-direction: column
    flex-wrap: nowrap
    justify-content: space-between
    align-content: stretch
    align-items: flex-start
  .status
    position: absolute
    top: -1rem
    right: -1rem
    height: 2rem
    width: 2rem
  .meta
    display: flex
    width: 30%
    background: var(--c-surface)
    border-radius: $border-radius
    padding: 1rem
    @media screen and (max-width: $breakpoint-mobile)
      width: 100%
    picture
      display: block
    img
      border-radius: $border-radius
  .content
    width: calc(70% - 2rem)
    color: var(--c-font)
    @media screen and (max-width: $breakpoint-mobile)
      width: 100%
      margin: 2rem 0 0 0
  .title
    font-size: 1.75rem
    line-height: 1.1
    margin: 0 0 .5rem 0
  .description
    margin: 2rem 0 0 0
  .links
    margin: 2rem 0 0 0
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: flex-start
    align-content: flex-start
    align-items: flex-start
    li
      margin: 0 1rem 0 0
      a
        color: var(--c-font)
        border-bottom: 2px solid var(--c-primary)
        transition: $animation
        text-decoration: none
        line-height: 1
        font-size: 1rem
        &:hover
          text-decoration: none
          border-color: transparent
          background: var(--c-primary)
          color: var(--c-light)
.nothing-found
  text-align: center
</style>
