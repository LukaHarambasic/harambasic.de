<script lang="ts">
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		prefix: string;
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { prefix, children, class: className, id }: Props = $props();
</script>

<div class="callout card" class:className {id}>
	{#if prefix}
		<strong>{prefix}</strong>
	{/if}
	<div class="content rich-text">
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="postcss">
	.callout {
		display: flex;
		strong {
			display: inline-block;
			padding: var(--s) var(--m);
			border: var(--border);
			border-radius: var(--border-radius-small);
			background: var(--c-surface-accent);
			flex: 1 0 auto;
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 900;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		.content {
			flex: 0 1 auto;
		}
	}
</style>
