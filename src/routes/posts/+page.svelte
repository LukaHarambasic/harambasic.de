<script lang="ts">
  import List from './List.svelte'
  import BaseFootnote from '$lib/components/Base/BaseFootnote.svelte'
  import type { PageData } from '../$types'

  export let data: PageData
  const [entries, tags] = data.posts
</script>

<List initEntries={entries} {tags} />
<BaseFootnote>
  <!-- TODO adapt urls -->
  Check out the <a href="">RSS feed</a> or
  <a href="">my Twitter account</a>
  to keep up to date.
</BaseFootnote>
