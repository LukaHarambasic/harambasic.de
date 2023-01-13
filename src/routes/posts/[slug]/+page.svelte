<script lang="ts">
  import type { Post } from '$lib/types/post'
  import type { PageData } from './$types'

  export let data: PageData
  const entry = data.posts[0]
</script>

{entry.title}
