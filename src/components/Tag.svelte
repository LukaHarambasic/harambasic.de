<script lang="ts">
  import type { CollectionEntry } from 'astro:content'

  let {
    tag,
    selected = false,
    href,
  }: {
    tag: CollectionEntry<'tags'>
    selected?: boolean
    href: string
  } = $props()
</script>

<a class="tag" {href} class:selected>
  {tag.data.title}
</a>

<style lang="postcss">
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
</style>
