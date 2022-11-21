<script lang="ts">
	import type { TocNode } from '../../types/post';
	import PostsTableOfContentNode from './PostsTableOfContentNode.svelte';

	export let nodes: TocNode[];
	console.log(nodes);
</script>

<div class="toc">
	<strong>Table of Content</strong>
	<ol class="nodes">
		{#each nodes as node}
			<PostsTableOfContentNode {node} />
		{/each}
	</ol>
</div>

<style lang="postcss" global>
	.toc {
		font-size: 1rem;
		strong {
			font-weight: 900;
			font-size: 1.25rem;
			line-height: 1.2;
			font-family: 'Source Sans Pro', sans-serif;
			letter-spacing: 0.2px;
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
						text-decoration-thickness: 0.15rem;
					}
				}
			}
		}
		> ol {
			margin: 0 0 0 var(--m);
		}
	}
</style>
