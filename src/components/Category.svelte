<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let {
    category,
    selected = false,
  }: {
    category: CollectionEntry<'categories'>
    selected?: boolean
  } = $props()

  console.log(category)
</script>

<button class="category" title={category.data.title} class:selected>
  {category.data.title}
</button>

<style lang="postcss">
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
</style>
