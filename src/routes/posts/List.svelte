<script lang="ts">
  import { onMount } from 'svelte'
  import type { Post } from '$lib/types/post'
  import { filterAndSortPosts } from '$lib/data/posts/helper'
  import { PostSortProperty, SortDirection } from '$lib/types/enums'
  import type { Tag } from '$lib/types/tag'
  import { enumToArray, sortAlphabetical } from '$lib/util/helper'

  export let initEntries: Post[]
  export let tags: Tag[]

  $: filterTagSlug = ''
  $: sortProperty = PostSortProperty.Published
  $: sortDirection = SortDirection.Desc
  $: entries = filterAndSortPosts(initEntries, filterTagSlug, sortProperty, sortDirection)

  const properties = enumToArray(PostSortProperty).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
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
    <div class="sorter card">
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
    <div class="tags card">
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
      {#each entries as post}
        <li class="h-feed">
          <a href={post.relativePath}>
            <div class="column">
              <strong class="title">
                {post.title}
              </strong>
              <ul class="tags">
                {#each post.tags as tag}
                  <li>
                    <a href={tag.relativePath} class="link">
                      {tag.display}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
            <time class="date dt-published" datetime={post?.published?.raw?.toString()}>
              {post.published.display}
            </time>
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 32 32"
              ><rect width="32" height="32" fill="none" /><circle
                cx="128"
                cy="128"
                r="96"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
              /><polyline
                points="134.1 161.9 168 128 134.1 94.1"
                fill="none"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
              /><line
                x1="88"
                y1="128"
                x2="168"
                y2="128"
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
  /* TODO: should be a grid */
  section {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 70ch;
    grid-template-areas: 'sorter entries' 'tags entries';
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
  .sorter {
    grid-area: sorter;
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
    grid-area: tags;
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
    grid-area: entries;
    width: 100%;
    > ul {
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
          padding: var(--l);
          color: var(--c-font);
          text-decoration: none;
          &:hover {
            transform: scale(1.05);
            cursor: pointer;
            svg {
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
            flex-wrap: nowrap;
            align-content: stretch;
            justify-content: flex-start;
            align-items: flex-start;
            gap: var(--xs);
            li {
              a {
                color: var(--c-font-accent-dark);
                font-weight: 400;
                font-size: var(--font-s);
                text-decoration: none;
                &:hover {
                  text-decoration: underline;
                  text-decoration-thickness: var(--underline-thickness);
                }
              }
            }
          }
          .date {
            display: inline-block;
            margin: 0 0 var(--xs) 0;
            font-size: var(--font-m);
          }
          svg {
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
