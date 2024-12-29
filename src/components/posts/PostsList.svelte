<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import Card from '@components/Card.svelte'
  import CategoryList from '@components/CategoryList.svelte'
  import Tags from '@components/Tags.svelte'
  import { categoryParamStore, tagParamStore } from '@util/urlStore.svelte'

  let { entries, categories, tags } = $props<{
    entries: CollectionEntry<'posts'>[]
    categories: CollectionEntry<'categories'>[]
    tags: CollectionEntry<'tags'>[]
  }>()

  const categoryParamId = $derived(categoryParamStore.searchParamId)
  const tagParamId = $derived(tagParamStore.searchParamId)

  let filteredEntries = $derived(
    entries.filter((entry: CollectionEntry<'posts'>) => {
      const hasCategory =
        categoryParamId && entry.data.category.id === categoryParamId
      const hasTag =
        tagParamId &&
        entry.data.tags.some(
          (tag: CollectionEntry<'tags'>) => tag.id === tagParamId
        )
      // If no params are set everythign should be in the list
      if (!categoryParamId && !tagParamId) return true
      // If both are set, it has to match both
      if (hasCategory && hasTag) return true
      if (!tagParamId && hasCategory) return true
      if (!categoryParamId && hasTag) return true
      return false
    })
  )

  function getEntriesCategories(id: string): CollectionEntry<'categories'>[] {
    return categories.filter(
      (category: CollectionEntry<'categories'>) => category.id === id
    )
  }

  function getEntriesTags(
    entryTagIds: { id: string }[]
  ): CollectionEntry<'tags'>[] {
    return tags.filter((tag: CollectionEntry<'tags'>) =>
      entryTagIds.find((entryTag) => tag.id === entryTag.id)
    )
  }
</script>

<section>
  <ul class="entries">
    {#if filteredEntries.length === 0 && (categoryParamId || tagParamId)}
      <Card>
        <p>
          No post was published with the selected category/tag. Try to remove
          one.
        </p>
      </Card>
    {:else}
      {#each filteredEntries as entry}
        <Card class="entry h-feed">
          <a href={`/posts/${entry.slug}`}>
            <div class="column">
              <CategoryList
                categories={getEntriesCategories(entry.data.category.id)}
              />
              <strong class="title">{entry.data.title}</strong>
            </div>
          </a>
          {#snippet left()}
            <Tags tags={getEntriesTags(entry.data.tags)} />
          {/snippet}
          {#snippet right()}
            <time class="dt-published" datetime={entry.data.published.raw}>
              {entry.data.published.formatted}
            </time>
          {/snippet}
        </Card>
      {/each}
    {/if}
  </ul>
  <aside>
    <Card direction="column">
      <h3>Categories</h3>
      <Categories {categories} />
    </Card>
    <Card direction="column">
      <h3>Tags</h3>
      <Tags {tags} />
    </Card>
  </aside>
</section>

<style lang="postcss">
  section {
    display: grid;
    grid-template-rows: auto auto auto;
    grid-template-columns: 70ch 1fr;
    column-gap: var(--l);
    row-gap: var(--l);
    width: 100%;
    @media screen and (max-width: 74rem) {
      grid-template-columns: 1fr 18rem;
    }
    @media screen and (max-width: 50rem) {
      grid-template-columns: 1fr;
    }
  }
  .entries {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    @media screen and (max-width: 50rem) {
      grid-template-columns: 1fr;
      order: 1;
    }
  }
  :global(.entries .entry) {
    transition: var(--transition);
    &:hover {
      transform: scale(0.97);
      cursor: pointer;
      :global(svg) {
        opacity: 1;
      }
    }
    a {
      display: flex;
      position: relative;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--l);
      color: var(--c-font);
      text-decoration: none;
      @media screen and (max-width: 50rem) {
        flex-direction: column-reverse;
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
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.03),
          0 2px 4px rgba(0, 0, 0, 0.03),
          0 4px 8px rgba(0, 0, 0, 0.03),
          0 8px 16px rgba(0, 0, 0, 0.03),
          0 16px 32px rgba(0, 0, 0, 0.03),
          0 32px 64px rgba(0, 0, 0, 0.03);
      }
    }
  }
  aside {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: 100%;
    @media screen and (max-width: 50rem) {
      grid-template-columns: 1fr;
      order: 0;
    }
    h3 {
      display: inline-block;
      font-weight: 900;
      font-size: var(--font-m);
      line-height: 1;
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);
    }
    .tags {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--xs);
      align-items: flex-start;
      justify-content: flex-start;
    }
  }
</style>
