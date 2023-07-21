<script lang="ts">
  import { page } from '$app/stores'
  import type { Tag } from '$lib/types/tag'
  import { setParam } from '$lib/util/helper'
  import { createEventDispatcher } from 'svelte'
  import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte'
    import BaseTag from '../Base/BaseTag.svelte'
    import type { B } from 'vitest/dist/types-198fd1d9'

  const dispatch = createEventDispatcher()

  export let tags: Tag[]

  $: tagSlug = $page.url.searchParams.get('tag') || 'all'

  function onTagChange(slug: string) {
    tagSlug = slug
    setParam('tag', slug)
    dispatch('tag', slug)
  }
</script>

<div class="tags card">
  <BaseHeadlineIcon title="Tags" icon="ph:hash-bold" />
  <ol>
    {#each tags as tag}
      <li>
        <BaseTag 
          tag={tag} 
          selected={tagSlug === tag.slug} 
          on:click={() => {
            onTagChange(tag.slug)
          }} />
      </li>
    {/each}
  </ol>
</div>

<style lang="postcss">
  .tags {
    grid-area: tags;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
    border: var(--border);
    ol {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--s);
    }
  }
</style>
