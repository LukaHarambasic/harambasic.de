<template>
  <div class="service">
    <component :is="iconComponent" class="icon" />
    <h3 class="title" v-html="title" />
    <p class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import IconsAgile from '@/components/Icons/IconsAgile.vue'
import IconsTool from '@/components/Icons/IconsTool.vue'
import IconsTech from '@/components/Icons/IconsTech.vue'
export default {
  name: 'ServicesBox',
  components: {
    IconsAgile,
    IconsTool,
  },
  props: {
    icon: {
      type: String,
      required: true,
      validator: (value) => {
        const validIcons = ['Agile', 'Tool', 'Tech']
        return validIcons.includes(value)
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  computed: {
    iconComponent() {
      switch (this.icon) {
        case 'Agile':
          return IconsAgile
        case 'Tool':
          return IconsTool
        case 'Tech':
          return IconsTech
        default:
          return IconsAgile
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.service
  width: calc(100% / 3)
  margin: 0 2rem 0 0
  text-align: center
  display: flex
  flex-direction: column
  flex-wrap: nowrap
  justify-content: flex-start
  align-content: stretch
  align-items: center
  background: var(--c-light)
  padding: 3rem
  border-radius: var(--border-radius)
  &:last-of-type
    margin: 0
  @media screen and (max-width: $breakpoint-desktop-breakout)
    margin: 0 0 5rem 0
    width: 100%
  @media screen and (max-width: $breakpoint-mobile)
    padding: 2rem
  .icon
    margin: -5.5rem 0 1rem 0
    background: var(--c-primary)
    border-radius: 100%
    padding: 1rem
    &::v-deep
      width: 5rem
      height: 5rem
    @media screen and (max-width: $breakpoint-mobile)
      margin: -4.5rem 0 1rem 0
  .title
    margin: 0 0 2rem 0
    font-size: 1.5rem
    line-height: 1.4
  .description
    text-align: center
</style>
