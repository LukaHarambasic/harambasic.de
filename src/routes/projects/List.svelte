<script lang="ts">
  import { onMount } from 'svelte'
  import { entries, filterTagSlug, tags } from '$lib/data/projects/store'

  onMount(() => {
    const slug = new URLSearchParams(window.location.search).get('tag') || 'all'
    filterTagSlug.set(slug)
  })

  function onSelectTag(slug: string) {
    filterTagSlug.set(slug)
    const url = new URL(window.location.toString())
    url.searchParams.set('tag', slug)
    window.history.pushState({}, '', url.href)
  }
</script>

<section>
  <!-- TODO extract -->
  <aside class="tags">
    <h2>Tags</h2>
    <ul>
      {#each $tags as tag}
        <li>
          <button
            class:selected={$filterTagSlug === tag.slug}
            on:click={() => onSelectTag(tag.slug)}
          >
            {tag.display} ({tag.count})
          </button>
        </li>
      {/each}
    </ul>
  </aside>
  <div class="entries">
    <ul>
      {#each $entries as entry}
        <li class="h-feed">
          <img src={entry.image} alt="TODO" width="8rem" />
          <div class="content">
            <strong>{entry.title}</strong>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--xl);
  }
  .tags {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
    width: var(--layout-sidebar);
    svg {
      fill: white;
      size: 2rem;
    }
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: flex-start;
      justify-content: flex-start;
      align-items: flex-start;
      gap: var(--s);
      li {
        button {
          margin: 0;
          border: none;
          background: none;
          padding: 0;
          color: var(--c-font-accent-dark);
          font-size: var(--font-s);
          text-align: left;
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
  .entries {
    width: 100%;
    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--xl);
      li {
        display: flex;
        position: relative;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
        transition: var(--transition);
        border-radius: var(--border-radius);
        background: var(--c-surface);
        height: 100%;
        color: var(--c-font);
        text-decoration: none;
        &:hover {
          transform: scale(1.05);
          cursor: pointer;
          svg {
            opacity: 1;
          }
        }
        > img {
          border-radius: var(--border-radius) var(--border-radius) 0 0;
          aspect-ratio: 1 / 1;
          width: 100%;
        }
        > .content {
          padding: var(--l);
          strong {
            display: block;
            margin: 0 0 var(--xs) 0;
            font-weight: 900;
            font-size: var(--font-m);
            line-height: 1.2;
            font-family: var(--font-family);
            letter-spacing: var(--font-letter-spacing-headline);
          }
        }
      }
    }
  }
</style>
