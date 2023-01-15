<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
  const entry = data.entry
</script>

{entry?.title}
