<script lang="ts">
  import type { CollectionEntry } from 'astro:content'
  import { categoryParamStore } from '@util/urlStore.svelte'
  import Category from './Category.svelte'

  let { categories } = $props<{
    categories: CollectionEntry<'categories'>[]
  }>()
</script>

<ul class="categories">
  {#each categories as category}
    <li>
      <Category
        {category}
        selected={categoryParamStore.searchParamId === category.id}
        onClickHandler={() => categoryParamStore.toggle(category.id)}
      />
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
  }
</style>
