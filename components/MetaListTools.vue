<template>
  <meta-list class="list" :items="toolsArray" pre-text="Tools:" />
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
.list
  margin: .25rem 0 .5rem 0
ul
  list-style: none
</style>
