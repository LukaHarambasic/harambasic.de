<script lang="ts">
  import type { PageData } from '../$types'
  import Entries from '$lib/components/Entries/Entries.svelte'
  import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte'
  import EntriesTags from '$lib/components/Entries/EntriesTags.svelte'
  import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte'
  import Icon from '@iconify/svelte'
  import { page } from '$app/stores'
  import { PostSortProperty, SortDirection } from '$lib/types/enums'
  import { filterAndSort } from '$lib/data/posts/helper'
  import BaseTag from '$lib/components/Base/BaseTag.svelte'
	import { onMount } from 'svelte';

  export let data: PageData
  const [entries, tags] = data.posts

  $: filterTagSlug = 'all'
  $: sortProperty = PostSortProperty.Published
  $: sortDirection = SortDirection.Desc
  $: filteredAndSortedEntries = filterAndSort(entries, filterTagSlug, sortProperty, sortDirection)

  function onProperty(event: { detail: PostSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }

  onMount(() => {
    filterTagSlug = ($page.url.searchParams.get('tag')) || 'all'
    sortProperty = ($page.url.searchParams.get('property') as PostSortProperty) || PostSortProperty.Published
    sortDirection = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc
	});
</script>

<Entries>
  <EntriesSidebar slot="sidebar">
    <EntriesSorter propertiesEnum={PostSortProperty} on:propertyChange={onProperty} on:directionChange={onDirection} />
    <EntriesTags {tags} on:tagChange={onTag} />
  </EntriesSidebar>
  <ul slot="entries" class="entries">
    {#each filteredAndSortedEntries as post}
      <li class="h-feed">
        <a href={post.relativePath}>
          <div class="column">
            <strong class="title">
              {post.title}
            </strong>
            <ul class="tags">
              {#each post.tags as tag}
                <li>
                  <BaseTag tag={tag} />
                </li>
              {/each}
            </ul>
          </div>
          <time class="date dt-published" datetime={post?.published?.raw?.toString()}>
            {post.published.display}
          </time>
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
    > li {
      > a {
        display: flex;
        position: relative;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--l);
        transition: var(--transition);
        border-radius: var(--border-radius);
        background: var(--c-surface);
        border: var(--border);
        padding: var(--l);
        color: var(--c-font);
        text-decoration: none;
        @media screen and (max-width: 50rem) {
          flex-direction: column-reverse;
        }
        &:hover {
          transform: scale(0.99);
          cursor: pointer;
          :global(svg) {
            opacity: 1;
          }
        }
        .column {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          align-content: stretch;
          justify-content: flex-start;
          align-items: stretch;
          gap: var(--xs);
        }
        .title {
          display: inline-block;
          font-weight: 900;
          font-size: var(--font-m);
          line-height: 1.2;
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
        .tags {
          flex-base: 100%;
          display: flex;
          flex-grow: 1;
          flex-direction: row;
          flex-wrap: wrap;
          align-content: stretch;
          justify-content: flex-start;
          align-items: flex-start;
          gap: var(--xs);
        }
        .date {
          display: inline-block;
          margin: 0 0 var(--xs) 0;
          color: var(--c-font);
          font-weight: 400;
          font-size: var(--font-m);
          text-decoration: none;
          font-style: italic;
          text-align: right;
          flex-shrink: 0;
          @media screen and (max-width: 50rem) {
            margin: 0 0 calc(-1 * var(--m)) 0;
            flex-shrink: 1;
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
