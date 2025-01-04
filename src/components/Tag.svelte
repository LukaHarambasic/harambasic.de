<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let {
    tag,
    selected = false,
    onClickHandler = () => {},
  } = $props<{
    tag: CollectionEntry<'tags'>
    selected?: boolean
    onClickHandler?: () => void
  }>()

  const isClickable =
    onClickHandler !== undefined && onClickHandler.toString() !== '() => {}'
</script>

<button
  class="tag"
  class:selected
  class:disabled={!isClickable}
  onclick={() => isClickable && onClickHandler()}
  data-text={tag?.data?.title}
  disabled={!isClickable}
>
  {tag?.data?.title}
</button>

<style lang="postcss">
  .tag {
    display: inline-block;
    text-align: center;
    color: var(--c-font-accent-dark);
    font-weight: 400;
    font-size: var(--font-s);
    text-decoration: none;
    border: none;
    background: transparent;
    transition: transform var(--transition-time) var(--transition-ease);
    font-style: italic;
    &:hover {
      text-decoration-thickness: var(--underline-thickness);
      text-decoration: underline;
      cursor: pointer;
    }
    &:before {
      content: '#';
    }
    &.selected {
      text-decoration-thickness: var(--underline-thickness);
      text-decoration: underline;
    }
    &.disabled {
      opacity: 1;
      cursor: default;
      &:hover {
        font-weight: 400;
        cursor: default;
        text-decoration: none;
      }
    }
  }
</style>
