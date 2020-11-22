<template>
  <meta-list class="tools" :items="toolsArray" pre-text="Tools:" />
</template>

<script>
import MetaList from '@/components/MetaList'
export default {
  name: 'MetaListTools',
  components: { MetaList },
  props: {
    tools: {
      type: String,
      required: true,
    },
  },
  computed: {
    toolsArray() {
      return this.tools.split(',').map((tool) => tool.trim())
    },
  },
}
</script>

<style lang="sass" scoped>
.tools
  margin: 0 0 1rem 0
ul
  list-style: none
</style>
