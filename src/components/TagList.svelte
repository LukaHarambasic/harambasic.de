<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import { tagParamStore } from '@util/urlStore.svelte'
  import Tag from './Tag.svelte'

  let { tags } = $props<{
    tags: CollectionEntry<'tags'>[]
  }>()
</script>

<ul class="tags">
  {#each tags as tag}
    <li>
      <Tag
        {tag}
        selected={tagParamStore.searchParamId === tag.id}
        onClickHandler={() => tagParamStore.toggle(tag.id)}
      />
    </li>
  {/each}
</ul>

<style lang="postcss">
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
  }
</style>
