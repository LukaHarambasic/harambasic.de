<script lang="ts">
	import type { TocNode } from '$lib/types/post';

	export let node: TocNode;
	const anchor = `#${node.slug}`;
</script>

<li>
	<a href={anchor}>{node.value}</a>
	<!-- Otherwise it throws an type error if done in a variable above -->
	{#if node.children && node.children.length !== 0}
		<ol>
			{#each node.children as child}
				<svelte:self node={child} />
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
