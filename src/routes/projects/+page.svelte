<script lang="ts">
  import { filterAndSort } from '$lib/data/projects/helper'
  import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums'
  import { page } from '$app/stores'
  import Entries from '$lib/components/Entries/Entries.svelte'
  import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte'
  import EntriesTags from '$lib/components/Entries/EntriesTags.svelte'
  import EntriesFilter from '$lib/components/Entries/EntriesFilter.svelte'
  import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  const [entries, tags] = data.projects

  $: filterTagSlug = $page.url.searchParams.get('tag') || 'all'
  $: filterStatus = ($page.url.searchParams.get('status') as ProjectStatus) || ProjectStatus.All
  $: sortProperty = ($page.url.searchParams.get('property') as ProjectSortProperty) || ProjectSortProperty.Published
  $: sortDirection = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc
  $: filteredAndSorted = filterAndSort(entries, filterTagSlug, filterStatus, sortProperty, sortDirection)

  function onProperty(event: { detail: ProjectSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }

  function onStatus(event: { detail: ProjectStatus }) {
    filterStatus = event.detail
  }
</script>

<Entries>
  <EntriesSidebar slot="sidebar">
    <EntriesSorter propertiesEnum={ProjectSortProperty} on:property={onProperty} on:direction={onDirection} />
    <EntriesFilter statusEnum={ProjectStatus} on:status={onStatus} />
    <EntriesTags {tags} on:tag={onTag} />
  </EntriesSidebar>
  <ul class="entries" slot="entries">
    {#each filteredAndSorted as entry}
      <li class="h-feed card">
        <!-- TODO <img src={entry.image} alt="TODO" width="8rem" /> -->
        <img src="https://TODO.com/image.png" alt="TODO" width="8rem" />
        <div class="content">
          <strong>{entry.title}</strong>
        </div>
      </li>
    {/each}
  </ul>
</Entries>

<style lang="postcss">
  .entries {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--l);
    li {
      display: flex;
      position: relative;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      transition: var(--transition);
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
</style>
