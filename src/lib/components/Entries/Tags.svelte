<script lang="ts">
  import { page } from '$app/stores'
  import type { Tag } from '$lib/types/tag'
  import Icon from '@iconify/svelte'

  export let tags: Tag[]

  $: tagSlug = $page.url.searchParams.get('tag') || 'all'

  function onSelect(slug: string) {
    console.log(slug)
    const url = new URL(window.location.toString())
    url.searchParams.set('tag', slug)
    window.history.pushState({}, '', url.href)
  }
</script>

<div class="tags card">
  <h3><Icon class="icon" icon="ph:hash-bold" /><span>Tags</span></h3>
  <ol>
    {#each tags as tag}
      <li>
        <button
          class:selected={tagSlug === tag.slug}
          on:click={() => {
            onSelect(tag.slug)
          }}
        >
          {tag.display} ({tag.count})
        </button>
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
    /* TODO should be a component - maybe no headline? */
    h3 {
      display: flex;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
      gap: 0.25rem;
      span {
        line-height: 1;
      }
      :global(.icon) {
        size: 1.4rem;
      }
    }
    ol {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--s);
      li {
        button {
          margin: 0;
          border: none;
          background: none;
          padding: 0;
          color: var(--c-font-accent-dark);
          font-size: var(--font-s);
          text-decoration: none;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
          }
          &.selected {
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
            &:hover {
              text-decoration: none;
            }
          }
        }
      }
    }
  }
</style>
