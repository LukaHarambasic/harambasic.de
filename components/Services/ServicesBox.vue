<template>
  <div class="service">
    <component :is="iconComponent" class="icon" />
    <h3 class="header">
      <span class="title">{{ title }}</span>
      <br />
      <span class="subtitle">{{ subtitle }}</span>
    </h3>
    <p class="description">
      {{ description }}
    </p>
  </div>
</template>

<script>
import IconsAgile from '@/components/Icons/IconsAgile.vue'
import IconsTool from '@/components/Icons/IconsTool.vue'
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
    subtitle: {
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
          return IconsAgile
        default:
          return IconsAgile
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.service
  text-align: center
  background: var(--c-light)
  padding: 4rem
  border-radius: var(--border-radius)
  margin: 0 2rem 0 0
  @media screen and (max-width: $breakpoint-desktop)
    margin: 0 0 2rem 0
  &:last-of-type
    margin: 0
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
      padding: .4rem .75rem
      font-weight: normal
      border-radius: 2px
  .description
    text-align: left
</style>
