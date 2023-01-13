<script lang="ts">
  import List from './List.svelte'
  import BaseFootnote from '$lib/components/Base/BaseFootnote.svelte'
  import type { Project } from '$lib/types/project'
  import type { PageData } from './$types'
  import { init } from '$lib/data/projects/store'
  import { onMount } from 'svelte'

  export let data: PageData
  const entries: Project[] = data.entries

  onMount(() => {
    init(entries)
  })
</script>

<List />
<BaseFootnote>
  <!-- TODO adapt urls -->
  Check out the <a href="globals.blogFeedURL">RSS feed</a> or
  <a href="TODO">my Twitter account</a>
  to keep up to date.
</BaseFootnote>
