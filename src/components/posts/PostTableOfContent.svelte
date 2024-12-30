<script lang="ts">
  import type { TocNode } from '@util/markdown'

  let { nestedToc } = $props<{
    nestedToc: TocNode[]
  }>()

  function getAnchor(slug: String) {
    return `#${slug}`
  }

  console.log(nestedToc)
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
    margin: 0 0 0 var(--m);
    list-style: decimal;
    ol {
      margin: 0 0 0 var(--l);
    }
  }
</style>
