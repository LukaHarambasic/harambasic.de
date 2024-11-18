<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let { tags } = $props<{
    tags: CollectionEntry<'tags'>[]
  }>()

  console.log(tags)

  const updateFilter = (id: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    const currentTag = searchParams.get('tag')

    if (currentTag === id) {
      searchParams.delete('tag')
    } else {
      searchParams.set('tag', id)
    }

    const url = new URL(window.location.toString())
    url.search = searchParams.toString()
    window.history.pushState({}, '', url.href)
  }

  // TODO use to set class
  const isSelected = (id: string) => {
    const searchParams = new SvelteURLSearchParams(window.location.search)
    return searchParams.get('tag') === id
  }
</script>

<ul class="tags">
  {#each tags as tag}
    <li>
      <button class="tag" onclick={() => updateFilter(tag.id)}>
        {tag?.data?.title}
      </button>
    </li>
  {/each}
</ul>

<style lang="postcss">
  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
    .tag {
      display: inline-block;
      text-align: center;
      color: var(--c-font-accent-dark);
      font-weight: 400;
      font-size: var(--font-s);
      text-decoration: none;
      padding: var(--xxs) var(--s);
      border-radius: var(--border-radius);
      background: var(--c-surface-accent);
      border: var(--border);
      transition: transform var(--transition-time) var(--transition-ease);
      &:hover {
        text-decoration: none;
        font-weight: bold;
        transform: scale(0.97);
      }
      &::before {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 0;
        overflow: hidden;
        visibility: hidden;
      }
      &.selected {
        font-weight: bold;
      }
    }
  }
</style>
