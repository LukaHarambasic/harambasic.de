<script lang="ts">
  import Entry from './Entry.svelte'
  import type { Post } from '$lib/types/post'
  import { findBySlug } from '$lib/util/entries'
  import type { PageData } from './$types'

  export let data: PageData
  const [entries, _] = data.posts
  const entry: Post | undefined = entries.find((entry) => findBySlug(entry, data.slug))
</script>

<Entry post={entry} />
