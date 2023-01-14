<script lang="ts">
  import { onMount } from 'svelte'
  import { filterAndSort } from '$lib/data/projects/helper'
  import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums'
  import type { Tag } from '$lib/types/tag'
  import { enumToArray, sortAlphabetical } from '$lib/util/helper'
  import type { Project } from '$lib/types/project'

  export let initEntries: Project[]
  export let tags: Tag[]

  $: filterTagSlug = ''
  $: filterStatus = ProjectStatus.None
  $: sortProperty = ProjectSortProperty.Priority
  $: sortDirection = SortDirection.Asc
  $: entries = filterAndSort(initEntries, filterTagSlug, filterStatus, sortProperty, sortDirection)

  const properties = enumToArray(ProjectSortProperty).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
  const directions = enumToArray(SortDirection).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))

  onMount(() => {
    const slug = new URLSearchParams(window.location.search).get('tag') || 'all'
    filterTagSlug = slug
  })

  function onSelectTag(slug: string) {
    filterTagSlug = slug
    const url = new URL(window.location.toString())
    url.searchParams.set('tag', slug)
    window.history.pushState({}, '', url.href)
  }
</script>

<section>
  <aside>
    <div class="sorter">
      <h3>Sort</h3>
      <div class="selects">
        <div class="wrapper">
          <label for="property">Property</label>
          <select bind:value={sortProperty} name="property">
            {#each properties as property}
              <option value={property.key}>{property.display}</option>
            {/each}
          </select>
        </div>
        <div class="wrapper">
          <label for="direction">Direction</label>
          <select bind:value={sortDirection} name="direction">
            {#each directions as direction}
              <option value={direction.key}>{direction.display}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <div class="tags">
      <h3>Tags</h3>
      <ol>
        {#each tags as tag}
          <li>
            <button class:selected={filterTagSlug === tag.slug} on:click={() => onSelectTag(tag.slug)}>
              {tag.display} ({tag.count})
            </button>
          </li>
        {/each}
      </ol>
    </div>
  </aside>
  <div class="entries">
    <ul>
      {#each entries as entry}
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
    width: 100%;
  }
  aside {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    width: var(--layout-sidebar);
    gap: var(--xl);
  }
  .sorter {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
    .selects {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--s);
      .wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
        gap: var(--xs);
        label {
          margin: 0;
          padding: 0;
          color: var(--c-font-accent-dark);
          font-size: var(--font-s);
          font-weight: bold;
        }
        select {
          margin: 0;
          border: none;
          padding: 0.25rem 0;
          color: var(--c-font-accent-dark);
          font-size: var(--font-s);
          &:hover {
            cursor: pointer;
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
          }
        }
      }
    }
  }
  .tags {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
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
