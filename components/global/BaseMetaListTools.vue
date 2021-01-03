<template>
  <base-meta-list class="tools" :items="toolsArray" pre-text="Tools:" />
</template>

<script>
import BaseMetaList from '@/components/global/BaseMetaList'
export default {
  name: 'BaseMetaListTools',
  components: { BaseMetaList },
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
</style>
