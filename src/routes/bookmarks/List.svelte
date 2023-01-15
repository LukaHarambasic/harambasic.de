<script lang="ts">
  import { filterAndSort } from '$lib/data/bookmarks/helper'
  import type { Bookmark } from '$lib/types/bookmark'
  import { BookmarkSortProperty, BookmarkStatus, SortDirection } from '$lib/types/enums'
  import type { Tag } from '$lib/types/tag'
  import { enumToArray, sortAlphabetical } from '$lib/util/helper'
  import { onMount } from 'svelte'

  export let initEntries: Bookmark[]
  export let tags: Tag[]

  $: filterTagSlug = ''
  $: filterStatus = BookmarkStatus.None
  $: sortProperty = BookmarkSortProperty.Published
  $: sortDirection = SortDirection.Asc
  $: entries = filterAndSort(initEntries, filterTagSlug, filterStatus, sortProperty, sortDirection)

  const properties = enumToArray(BookmarkSortProperty).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
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
          <a href={entry.url}>
            <div class="logo">
              <img src={entry.image} alt={entry.title} width="64px" />
            </div>
            <div class="content">
              <strong class="title">
                {entry.title}
              </strong>
              <p>{entry.description}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"
              ><rect width="256" height="256" fill="none" /><polyline
                points="216 100 216 40 156 40"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
              /><line
                x1="144"
                y1="112"
                x2="216"
                y2="40"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
              /><path
                d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
              /></svg
            >
          </a>
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
    > ul {
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
          overflow: hidden;
          color: var(--c-font);
          text-decoration: none;
          &:hover {
            transform: scale(1.05);
            cursor: pointer;
            svg {
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
          > svg {
            size: var(--l);
            position: absolute;
            top: var(--m);
            right: calc((-1) * var(--m));
            opacity: 0;
            transition: var(--transition);
            border: 4px solid var(--c-light);
            border-radius: 100%;
            background: var(--c-light);
          }
        }
      }
    }
  }
</style>
