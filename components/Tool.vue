<template>
  <div class="project">
    <div class="row-space-between">
      <div class="title" v-text="title" />
      <div class="price" v-text="price" />
    </div>
    <meta-list
      class="alternatives"
      pre-text="Alternatives:"
      :items="alternativesArray"
    />
    <p class="content">
      <slot />
    </p>
  </div>
</template>

<script>
import MetaList from '@/components/MetaList'
export default {
  name: 'Tool',
  components: { MetaList },
  props: {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: '',
    },
    alternatives: {
      type: String,
      default: '',
    },
  },
  computed: {
    alternativesArray() {
      return this.alternatives.split(',')
    },
  },
}
</script>

<style lang="sass" scoped>
.project
  background: $color-secondary
  padding: 2rem
  border-radius: $border-radius
  @media (prefers-color-scheme: dark)
    color: $color-primary
.title
  font-weight: bold
  font-size: 1.75rem
  line-height: 1.1
  margin: 0 0 .5rem 0
.price
  background: $color-primary
  color: $color-light
  padding: .5rem
  border-radius: $border-radius
  font-size: .9rem
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 .25rem .25rem
ul
  list-style: none
</style>
