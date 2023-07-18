<script lang="ts">
  import { page } from '$app/stores'
  import Entries from '$lib/components/Entries/Entries.svelte'
  import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte'
  import EntriesTags from '$lib/components/Entries/EntriesTags.svelte'
  import EntriesFilter from '$lib/components/Entries/EntriesFilter.svelte'
  import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte'
  import { filterAndSort } from '$lib/data/bookmarks/helper'
  import { BookmarkSortProperty, BookmarkStatus, SortDirection } from '$lib/types/enums'
  import type { PageData } from './$types'
  import Icon from '@iconify/svelte'

  export let data: PageData
  const [entries, tags] = data.bookmarks

  // all that "as" stuff should be removed, thats not right
  $: filterTagSlug = $page.url.searchParams.get('tag') || 'all'
  $: filterStatus = ($page.url.searchParams.get('status') as BookmarkStatus) || BookmarkStatus.All
  $: sortProperty = ($page.url.searchParams.get('property') as BookmarkSortProperty) || BookmarkSortProperty.Published
  $: sortDirection = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc
  $: filteredAndSorted = filterAndSort(entries, filterTagSlug, filterStatus, sortProperty, sortDirection)

  function onProperty(event: { detail: BookmarkSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }

  function onStatus(event: { detail: BookmarkStatus }) {
    filterStatus = event.detail
  }
</script>

<Entries>
  <EntriesSidebar slot="sidebar">
    <EntriesSorter propertiesEnum={BookmarkSortProperty} on:property={onProperty} on:direction={onDirection} />
    <EntriesFilter statusEnum={BookmarkStatus} on:status={onStatus} />
    <EntriesTags {tags} on:tag={onTag} />
  </EntriesSidebar>
  <ul slot="entries" class="entries">
    {#each filteredAndSorted as entry}
      <li class="h-feed">
        <a href={entry.url}>
          <div class="logo">
            <!-- TODO <img src={entry.image} alt={entry.title} width="64px" /> -->
            <img src="https://TODO.com/image.png" alt={entry.title} width="64px" />
          </div>
          <div class="content">
            <strong class="title">
              {entry.title}
            </strong>
            <p>{entry.description}</p>
          </div>
          <Icon class="arrow" icon="ph:arrow-circle-right-bold" />
        </a>
      </li>
    {/each}
  </ul>
</Entries>

<style lang="postcss">
  .entries {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: 100%;
    > li {
      width: 100%;
      > a {
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: flex-start;
        justify-content: flex-start;
        align-items: stretch;
        transition: var(--transition);
        border-radius: var(--border-radius);
        background: var(--c-surface);
        color: var(--c-font);
        text-decoration: none;
        &:hover {
          transform: scale(0.99);
          cursor: pointer;
          :global(svg) {
            opacity: 1;
          }
        }
        .logo {
          flex-base: 16rem;
          display: flex;
          flex-shrink: 1;
          flex-direction: column;
          flex-wrap: nowrap;
          align-content: center;
          justify-content: center;
          background: var(--c-font-accent-super-light);
          padding: var(--l);
          img {
            height: 4rem;
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          align-content: stretch;
          justify-content: flex-start;
          align-items: stretch;
          gap: var(--xs);
          padding: var(--l);
          .title {
            display: inline-block;
            font-weight: 900;
            font-size: var(--font-m);
            line-height: 1.2;
            font-family: var(--font-family);
            letter-spacing: var(--font-letter-spacing-headline);
          }
        }
        :global(.arrow) {
          color: var(--c-font-accent-dark);
          size: var(--l);
          position: absolute;
          top: var(--m);
          right: calc((-1) * var(--m));
          opacity: 0;
          transition: var(--transition);
          border: 4px solid var(--c-light);
          border-radius: 100%;
          background: var(--c-light);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.03), 0 4px 8px rgba(0, 0, 0, 0.03),
            0 8px 16px rgba(0, 0, 0, 0.03), 0 16px 32px rgba(0, 0, 0, 0.03), 0 32px 64px rgba(0, 0, 0, 0.03);
        }
      }
    }
  }
</style>
