<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let { categories } = $props<{
    categories: CollectionEntry<'categories'>[]
  }>()

  let currentCategory = $state()

  const toggleSearchParam = (id: string) => {
    const searchParams = new URLSearchParams(window.location.search)

    if (currentCategory === id) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }

    const url = new URL(window.location.toString())
    url.search = searchParams.toString()
    window.history.pushState({}, '', url.href)

    currentCategory = searchParams.get('category')
  }
</script>

<ul class="categories">
  {#each categories as category}
    <li>
      <button
        class="category"
        class:selected={currentCategory === category.id}
        onclick={() => toggleSearchParam(category.id)}
      >
        {category?.data?.title}
      </button>
    </li>
  {/each}
</ul>

<style lang="postcss">
  .categories {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--xs);
    align-items: flex-start;
    justify-content: flex-start;
    .category {
      text-align: center;
      color: var(--c-font-accent-dark);
      font-weight: 400;
      font-size: var(--font-s);
      text-decoration: none;
      background: transparent;
      border: none;
      transition: transform var(--transition-time) var(--transition-ease);
      font-size: var(--font-s);
      &:hover {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
        font-weight: bold;
        cursor: pointer;
      }
      &.selected {
        text-decoration-thickness: var(--underline-thickness);
        text-decoration: underline;
      }
    }
  }
</style>
