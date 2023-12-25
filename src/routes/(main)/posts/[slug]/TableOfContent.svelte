<script lang="ts">
  import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte'
  import type { TocNode } from '$lib/types/post'
  import PostsTableOfContentNode from './TableOfContentNode.svelte'

  export let nodes: TocNode[]
</script>

<div class="toc">
  <BaseHeadlineIcon title="Table of Content" icon="ph:list-bullets-bold" />
  <ol class="nodes">
    {#each nodes as node}
      <PostsTableOfContentNode {node} />
    {/each}
  </ol>
</div>

<style lang="postcss" global>
  .toc {
    font-size: var(--font-m);
    ol {
      margin: 0 0 0 var(--l);
      list-style: decimal;
    }
    > ol {
      margin: 0 0 0 var(--m);
    }
  }
</style>
