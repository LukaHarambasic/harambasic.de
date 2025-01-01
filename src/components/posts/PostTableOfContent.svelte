<script lang="ts">
  import type { TocNode } from '@util/markdown'

  let { nestedToc } = $props<{
    nestedToc: TocNode[]
  }>()

  function getAnchor(slug: String) {
    return `#${slug}`
  }
</script>

<ol class="toc">
  {#each nestedToc as node}
    {@render singleNode(node)}
  {/each}
</ol>

{#snippet singleNode(node: TocNode)}
  <li>
    <a href={getAnchor(node.slug)}>{node.text}</a>
    {#if node.children && node.children.length !== 0}
      <ol>
        {#each node.children as child}
          {@render singleNode(child)}
        {/each}
      </ol>
    {/if}
  </li>
{/snippet}

<style lang="postcss">
  .toc {
    font-size: var(--font-m);
    line-height: 1.5;
    list-style: decimal;
    margin: 0 0 0 var(--m);
    ol {
      list-style: lower-alpha;
      margin: 0 0 0 var(--s);
    }
    a {
      color: var(--c-font);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        text-decoration-thickness: var(--underline-thickness);
      }
    }
  }
</style>
