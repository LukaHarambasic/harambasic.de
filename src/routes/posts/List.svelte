<script lang="ts">
  import type { Post } from '$lib/types/post'
  import { filterAndSortPosts } from '$lib/data/posts/helper'
  import { PostSortProperty } from '$lib/types/enums'
  import { SortDirection } from '$lib/types/enums'
  import type { Tag } from '$lib/types/tag'
  import Icon from '@iconify/svelte'
  import { page } from '$app/stores'
  import Sort from '$lib/components/Entries/Sort.svelte'
  import Tags from '$lib/components/Entries/Tags.svelte'

  export let initEntries: Post[]
  export let tags: Tag[]

  $: filterTagSlug = $page.url.searchParams.get('tag') || 'all'
  $: sortProperty = $page.url.searchParams.get('property') || PostSortProperty.Published
  $: sortDirection = $page.url.searchParams.get('direction') || SortDirection.Desc
  $: entries = filterAndSortPosts(initEntries, filterTagSlug, sortProperty, sortDirection)

  function onProperty(event: { detail: PostSortProperty }) {
    sortProperty = event.detail
  }

  function onDirection(event: { detail: SortDirection }) {
    sortDirection = event.detail
  }

  function onTag(event: { detail: string }) {
    filterTagSlug = event.detail
  }
</script>

<section>
  <aside>
    <Sort propertiesEnum={PostSortProperty} on:property={onProperty} on:direction={onDirection} />
    <Tags {tags} on:tag={onTag} />
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
            <Icon class="arrow" icon="ph:arrow-circle-right-bold" />
          </a>
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
    grid-template-areas: 'sorting entries' 'tags entries';
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
          border: var(--border);
          padding: var(--l);
          color: var(--c-font);
          text-decoration: none;
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
  }
</style>
