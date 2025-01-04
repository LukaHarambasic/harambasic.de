<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import Card from '@components/Card.svelte'
  import Category from '@components/Category.svelte'
  import Tag from '@components/Tag.svelte'

  let { entries, categories, tags } = $props<{
    entries: CollectionEntry<'categories'>[]
    categories: CollectionEntry<'categories'>[]
    tags: CollectionEntry<'tags'>[]
  }>()

  function getEntryCategory(id: string): CollectionEntry<'categories'> {
    return categories.filter(
      (category: CollectionEntry<'categories'>) => category.id === id
    )[0]
  }

  function getEntryTags(
    entryTagIds: { id: string }[]
  ): CollectionEntry<'tags'>[] {
    return tags.filter((tag: CollectionEntry<'tags'>) =>
      entryTagIds.find((entryTag) => tag.id === entryTag.id)
    )
  }
</script>

<ul class="entries">
  {#each entries as entry, index}
    <a href={`/projects/${entry.slug}`}>
      <Card class="entry h-feed">
        {#if index < 4}
          <!-- image -->
        {/if}
        <div class="column">
          <Category category={getEntryCategory(entry.data.category.id)} />
          <strong class="title">{entry.data.title}</strong>
          <p class="description">{entry.data.description}</p>
        </div>
        {#snippet left()}
          <ul class="tags">
            {#each getEntryTags(entry.data.tags) as tag}
              <li>
                <Tag {tag} />
              </li>
            {/each}
          </ul>
        {/snippet}
      </Card>
    </a>
  {/each}
</ul>

<style lang="postcss">
  .entries {
    width: 70ch;
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
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
  }
  :global(.entries a) {
    transition: var(--transition);
    text-decoration: none;
    &:hover {
      transform: scale(0.97);
      cursor: pointer;
      :global(svg) {
        opacity: 1;
      }
    }
    .column {
      display: flex;
      position: relative;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: flex-start;
      justify-content: flex-start;
      gap: var(--xs);
      color: var(--c-font);
      @media screen and (max-width: 50rem) {
        flex-direction: column-reverse;
      }
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
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.03),
        0 2px 4px rgba(0, 0, 0, 0.03),
        0 4px 8px rgba(0, 0, 0, 0.03),
        0 8px 16px rgba(0, 0, 0, 0.03),
        0 16px 32px rgba(0, 0, 0, 0.03),
        0 32px 64px rgba(0, 0, 0, 0.03);
    }
  }
</style>
