<script lang="ts">
	import type { TocNode } from '../../types/post'

	export let node: TocNode
	const anchor = `#${node.slug}`
	const hasChildren = node.children && node.children.length !== 0
</script>

<li>
	<a href={anchor}>{node.text}</a>
	{#if hasChildren}
		<ol>
			{#each node.children as child}
				<svelte:self node={child} />
			{/each}
		</ol>
	{/if}
</li>

<style lang="postcss">
</style>
