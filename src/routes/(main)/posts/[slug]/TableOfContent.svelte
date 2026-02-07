<script lang="ts">
	import type { TocNode } from '$lib/types/post';
	import TableOfContentRecursive from './TableOfContent.svelte';

	interface Props {
		nodes: TocNode[];
	}

	let { nodes }: Props = $props();
</script>

{#if nodes.length > 0}
	<ol class="table-of-content">
		{#each nodes as node (node.slug)}
			<li class="toc-node">
				<a href="#{node.slug}">{node.value}</a>
				{#if node.children && node.children.length > 0}
					<TableOfContentRecursive nodes={node.children} />
				{/if}
			</li>
		{/each}
	</ol>
{/if}

<style lang="postcss">
	.table-of-content {
		margin: 0;
		padding-left: var(--m);
		list-style-type: none;
		:global(.table-of-content) {
			margin: var(--xs) 0 0 var(--m);
			padding-left: var(--m);
		}
		.toc-node {
			a {
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-s);
				text-decoration: none;
			}
			a:hover {
				text-decoration: underline;
			}
		}
	}
</style>
