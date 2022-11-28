<script lang="ts">
	import type { TocNode } from '../../types/post'
	import PostsTableOfContentNode from './PostsTableOfContentNode.svelte'

	export let nodes: TocNode[]
</script>

<div class="toc">
	<strong>Table of Contents</strong>
	<ol class="nodes">
		{#each nodes as node}
			<PostsTableOfContentNode {node} />
		{/each}
	</ol>
</div>

<style lang="postcss" global>
	.toc {
		font-size: var(--font-m);
		strong {
			font-weight: 900;
			font-size: var(--font-l);
			line-height: 1.2;
			font-family: var(--font-family);
			letter-spacing: var(--font-letter-spacing-headline);
		}
		ol {
			margin: 0 0 0 var(--l);
			list-style: decimal;
			li {
				margin: var(--s) 0 0 0;
				a {
					color: var(--c-font);
					text-decoration: none;
					&:hover {
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
					}
				}
			}
		}
		> ol {
			margin: 0 0 0 var(--m);
		}
	}
</style>
