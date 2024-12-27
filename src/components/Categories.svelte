<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import { isBrowser } from '@util/helpers'

  let { categories } = $props<{
    categories: CollectionEntry<'categories'>[]
  }>()

  let currentCategory: string | null = $state(null)
  let handleToggle: ((id: string) => void) | undefined

  if (isBrowser) {
    const initBrowserLogic = async () => {
      const { getCurrentCategory, toggleCategory } = await import(
        '@util/categoryStore.svelte.ts'
      )
      currentCategory = getCurrentCategory()
      handleToggle = toggleCategory
    }
    initBrowserLogic()
  }
</script>

<ul class="categories">
  {#each categories as category}
    <li>
      <button
        class="category"
        class:selected={currentCategory === category.id}
        onclick={() => handleToggle?.(category.id)}
        data-text={category?.data?.title}
      >
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
      text-align: center;
      color: var(--c-font);
      font-weight: 400;
      font-size: var(--font-s);
      text-decoration: none;
      background: var(--c-surface-accent);
      border-radius: var(--border-radius);
      border: var(--border);
      padding: var(--xxs) var(--s);
      transition: transform var(--transition-time) var(--transition-ease);
      position: relative;
      &::after {
        content: attr(data-text);
        display: block;
        height: 0;
        visibility: hidden;
        overflow: hidden;
        font-weight: bold;
      }

      &:hover {
        font-weight: bold;
        cursor: pointer;
      }
      &.selected {
        font-weight: bold;
        background: var(--c-surface-accent-dark);
        color: var(--c-font-accent);
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
</style>
