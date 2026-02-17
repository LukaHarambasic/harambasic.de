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
		display: flex;
		margin: 0;
		padding-left: var(--m);
		flex-direction: column;
		gap: var(--s);
		list-style-type: none;
		:global(.table-of-content) {
			margin: var(--s) 0 0 var(--m);
			padding-left: var(--m);
			gap: var(--s);
		}
		.toc-node {
			a {
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-m);
				text-decoration: none;
				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
</style>
