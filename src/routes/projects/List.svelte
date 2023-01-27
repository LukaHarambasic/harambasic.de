<script lang="ts">
  import { filterAndSort } from '$lib/data/projects/helper'
  import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums'
  import type { Tag } from '$lib/types/tag'
  import type { Project } from '$lib/types/project'
  import { page } from '$app/stores'
  import Sort from '$lib/components/Entries/Sort.svelte'
  import Tags from '$lib/components/Entries/Tags.svelte'
  import Filter from '$lib/components/Entries/Filter.svelte'

  export let initEntries: Project[]
  export let tags: Tag[]

  $: filterTagSlug = $page.url.searchParams.get('tag') || 'all'
  $: filterStatus = $page.url.searchParams.get('status') || ProjectStatus.All
  $: sortProperty = $page.url.searchParams.get('property') || ProjectSortProperty.Published
  $: sortDirection = $page.url.searchParams.get('direction') || SortDirection.Desc
  $: entries = filterAndSort(initEntries, filterTagSlug, filterStatus, sortProperty, sortDirection)

  function onProperty(event: { detail: ProjectSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }

  function onStatus(event: { detail: string }) {
    filterStatus = event.detail
  }
</script>

<section>
  <aside>
    <Sort propertiesEnum={ProjectSortProperty} on:property={onProperty} on:direction={onDirection} />
    <Filter statusEnum={ProjectStatus} on:status={onStatus} />
    <Tags {tags} on:tag={onTag} />
  </aside>
  <div class="entries">
    <ul>
      {#each entries as entry}
        <li class="h-feed card">
          <!-- TODO <img src={entry.image} alt="TODO" width="8rem" /> -->
          <img src="https://TODO.com/image.png" alt="TODO" width="8rem" />
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
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 70ch;
    grid-template-areas: 'sorting entries' 'status entries' 'tags entries';
    column-gap: var(--l);
    row-gap: var(--l);
    width: 100%;
  }
  aside {
    position: sticky;
    top: var(--l);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: 100%;
  }
  .sort {
    grid-area: sorting;
  }
  .tags {
    grid-area: tags;
  }
  .status {
    grid-area: status;
  }
  .entries {
    width: 100%;
    ul {
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
  }
</style>
