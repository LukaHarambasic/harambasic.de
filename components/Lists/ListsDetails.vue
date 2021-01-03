<template>
  <article class="post h-entry">
    <header>
      <h1 class="p-name" v-text="list.title" />
      <p v-text="list.description" />
    </header>
    <section>
      <ul>
        <li v-for="entry in list.entries" :key="entry.title">
          <a :href="entry.url">
            <div class="logo">
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
  @media screen and (max-width: $breakpoint-mobile)
    width: calc(100% + (2 * 1rem))
    margin: 0 0 0 -1rem
  > a
    display: grid
    grid-template-areas: "logo content"
    grid-template-columns: 5rem 1fr
    grid-template-rows: auto
    grid-gap: 2rem
    text-decoration: none
    color: $color-primary
    transition: $animation
    border-radius: $border-radius
    padding: 1rem
    @media (prefers-color-scheme: dark)
      color: $color-light
      &:hover
        color: $color-primary
    @media screen and (max-width: $breakpoint-mobile)
      // TODO
    &:hover
      background: $color-secondary
    .logo
      grid-area: logo
      height: 5rem
      display: grid
      justify-content: center
      img
        width: 5rem
        height: 5rem
        background: $color-light
        border-radius: $border-radius
        box-shadow: $box-shadow
        padding: 1rem
    .header
      line-height: 1
      margin: 0 0 .25rem 0
    .content
      grid-area: content
    .title
      font-size: 1.5rem
      font-weight: bold
</style>
