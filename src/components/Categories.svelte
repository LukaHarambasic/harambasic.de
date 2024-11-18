<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let { categories } = $props<{
    categories: CollectionEntry<'categories'>[]
  }>()

  const updateFilter = (id: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    const currentCategory = searchParams.get('category')

    if (currentCategory === id) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }

    const url = new URL(window.location.toString())
    url.search = searchParams.toString()
    window.history.pushState({}, '', url.href)
  }

  // TODO use to set class, add a cross to the button to make it obvious that it can be removed
  const isSelected = (id: string) => {
    const searchParams = new SvelteURLSearchParams(window.location.search)
    return searchParams.get('category') === id
  }
</script>

<ul class="categories">
  {#each categories as category}
    <li>
      <button class="category" onclick={() => updateFilter(category.id)}>
        {category?.data?.title}
      </button>
    </li>
  {/each}
</ul>

<style lang="postcss">
  .categories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
    .category {
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
