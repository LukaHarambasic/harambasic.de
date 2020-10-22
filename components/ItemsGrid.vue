<template>
  <section>
    <ul>
      <nuxt-link
        v-for="item in items"
        :key="item.slug"
        :to="item.path"
        tag="li"
      >
        <img class="image" :src="item.dir + '/' + item.img" :alt="item.alt" />
        <h2 class="title" v-text="item.title" />
      </nuxt-link>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Items',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped>
ul
  display: flex
  flex-direction: row
  flex-wrap: wrap
  justify-content: flex-start
  align-content: stretch
  align-items: stretch
  @media screen and (max-width: $breakpoint-desktop)
    flex-direction: column
li
  width: calc((100% / 3) - (8rem / 3)) //4rem between the 3 items per row, space between can't be used as rows arent't filled from the start
  margin: 0 4rem 4rem 0
  background: $color-secondary
  border-radius: $border-radius
  padding: 1.5rem
  transition: $animation
  @media screen and (max-width: $breakpoint-desktop)
    width: 100%
    margin: 0 0 4rem 0
    padding: 2rem
  @media screen and (max-width: $breakpoint-mobile)
    margin: 0 0 2rem 0
  &:nth-child(3n+3)
    margin: 0 0 4rem 0
    @media screen and (max-width: $breakpoint-mobile)
      margin: 0 0 2rem 0
  &:hover
    cursor: pointer
    transform: scale(1.05)
    .image
      filter: grayscale(0%)
      opacity: 1
.image
  margin: 0 0 1rem 0
  height: 20rem
  width: 100%
  object-fit: cover
  transition: $animation
  filter: grayscale(100%)
  opacity: 0.7
  @media screen and (max-width: $breakpoint-desktop)
    height: auto
.title
  font-size: 1.2rem
  margin: 0
  text-align: center
</style>
