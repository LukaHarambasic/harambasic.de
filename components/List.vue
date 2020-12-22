<template>
  <article class="post h-entry">
    <header>
      <h1 class="p-name" v-text="item.title" />
      <p v-text="item.description" />
    </header>
    <section>
      <ul>
        <li v-for="entry in item.list" :key="entry.title">
          <a :href="entry.url">
            <img class="logo" :src="entry.logo" :alt="entry.title" />
            <div class="content">
              <div class="header">
                <strong class="title" v-text="entry.title" />
                <strong
                  v-if="entry.language"
                  class="language"
                  v-text="languageWithBrackets(entry.language)"
                />
              </div>
              <p class="description" v-text="entry.description" />
            </div>
          </a>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    languageWithBrackets(language) {
      if (!language) return ''
      return `(${language})`
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
  > p
li
  > a
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: flex-start
    align-content: stretch
    align-items: center
    margin: 0 0 1rem 0
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
      flex-direction: column
      justify-content: flex-start
      align-items: flex-start
    &:hover
      background: $color-secondary
    .logo
      width: 5rem
      height: 5rem
      margin: 0 2rem 0 0
    .title
      font-size: 1.5rem
      font-weight: bold
</style>
