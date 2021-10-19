<template>
  <article class="post h-entry">
    <header>
      <h1 v-text="list.title" />
      <p v-text="list.description" />
    </header>
    <section>
      <ul>
        <li v-for="(entry, index) in list.entries" :key="index">
          <a :href="entry.url">
            <div v-if="!list.hideLogos" class="logo">
              <img v-if="entry.logo" :src="entry.logo" :alt="entry.title" />
            </div>
            <div class="content">
              <div class="header">
                <strong class="title" v-text="entry.title" />
                <strong
                  v-if="entry.extra"
                  class="extra"
                  v-text="extraWithBrackets(entry.extra)"
                />
              </div>
              <p class="description" v-text="entry.description" />
            </div>
          </a>
        </li>
      </ul>
    </section>
    <base-footnote v-if="list.footnote">
      {{ list.footnote }}
    </base-footnote>
  </article>
</template>

<script>
export default {
  name: 'ListsDetail',
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  methods: {
    extraWithBrackets(extra) {
      if (!extra) return ''
      return `(${extra})`
    },
  },
}
</script>

<style lang="sass" scoped>
header
  margin: 0 0 2rem 0
  > h1
    font-size: 1.75rem
    line-height: 1.5
    margin: 0 0 1rem 0
li
  margin: 0 0 2rem 0
  @media screen and (max-width: $breakpoint-mobile)
    width: calc(100% + (2 * 1rem))
    margin: 0 0 0 -1rem
  > a
    display: flex
    flex-wrap: nowrap
    flex-direction: row
    justify-content: flex-start
    align-content: flex-start
    text-decoration: none
    color: var(--c-font)
    transition: $animation
    border-radius: $border-radius
    padding: 2rem
    background: var(--c-light)
    &:hover
      color: var(--c-font-on-primary)
      background: var(--c-primary)
    @media screen and (max-width: $breakpoint-mobile)
      flex-direction: column
    .logo
      flex: 0 0 auto
      height: 5rem
      width: 5rem
      margin: 0 2rem 0 0
      display: grid
      justify-content: center
      @media screen and (max-width: $breakpoint-mobile)
        margin: 0 0 1rem 0
        height: auto
      img
        width: 5rem
        height: 5rem
        background: var(--c-surface)
        border-radius: $border-radius
        padding: 1rem
    .header
      line-height: 1
      margin: 0 0 .25rem 0
    .title
      font-size: 1.5rem
      font-weight: bold
</style>
