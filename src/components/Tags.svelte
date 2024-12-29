<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import { tagParamStore } from '@util/urlStore.svelte'

  let { tags } = $props<{
    tags: CollectionEntry<'tags'>[]
  }>()
</script>

<ul class="tags">
  {#each tags as tag}
    <li>
      <button
        class="tag"
        class:selected={tagParamStore.searchParamId === tag.id}
        onclick={() => tagParamStore.toggle(tag.id)}
      >
        {tag.data.title}
      </button>
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
    .tag {
      display: inline-block;
      text-align: center;
      color: var(--c-font-accent-dark);
      font-weight: 400;
      font-size: var(--font-s);
      text-decoration: none;
      border: none;
      background: transparent;
      transition: transform var(--transition-time) var(--transition-ease);
      font-style: italic;
      &:hover {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
        cursor: pointer;
      }
      &:before {
        content: '#';
      }
      &.selected {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
      }
    }
  }
</style>
