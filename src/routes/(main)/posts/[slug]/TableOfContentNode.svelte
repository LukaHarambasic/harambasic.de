<script lang="ts">
	import TableOfContentNode from './TableOfContentNode.svelte';
	import type { TocNode } from '$lib/types/post';

	interface Props {
		node: TocNode;
	}

	let { node }: Props = $props();
	const anchor = `#${node.slug}`;
</script>

<li>
	<a href={anchor}>{node.value}</a>
	<!-- Otherwise it throws an type error if done in a variable above -->
	{#if node.children && node.children.length !== 0}
		<ol>
			{#each node.children as child}
				<TableOfContentNode node={child} />
			{/each}
		</ol>
	{/if}
</li>

<style lang="postcss">
	ol {
		margin: 0 0 0 var(--l);
		list-style: decimal;
	}
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
</style>
