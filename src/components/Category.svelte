<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let {
    category,
    selected = false,
    onClickHandler = () => {},
  } = $props<{
    category: CollectionEntry<'categories'>
    selected?: boolean
    onClickHandler?: () => void
  }>()

  const isClickable =
    onClickHandler !== undefined && onClickHandler.toString() !== '() => {}'

  console.log('---- Category.svelte ----')
  console.log(category)
</script>

<button
  class="category"
  class:selected
  class:disabled={!isClickable}
  onclick={() => isClickable && onClickHandler()}
  data-text={category?.data?.title}
  disabled={!isClickable}
>
  {category?.data?.title}
</button>

<style lang="postcss">
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
    &.disabled {
      opacity: 1;
      cursor: default;
      &:hover {
        font-weight: 400;
        cursor: default;
      }
    }
  }
</style>
