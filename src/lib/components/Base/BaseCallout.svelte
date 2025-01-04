<script lang="ts">
	interface Props {
		prefix: string;
		children?: import('svelte').Snippet;
	}

	let { prefix, children }: Props = $props();
</script>

<div class="callout card">
	{#if prefix}
		<strong>{prefix}</strong>
	{/if}
	<div class="content rich-text">
		{@render children?.()}
	</div>
</div>

<style lang="postcss">
	.callout {
		display: flex;
		strong {
			flex: 1 0 auto;
			display: inline-block;
			border-radius: var(--border-radius-small);
			background: var(--c-surface-accent);
			padding: var(--s) var(--m);
			font-weight: 900;
			font-size: var(--font-m);
			font-family: var(--font-family);
			letter-spacing: var(--font-letter-spacing-headline);
			border: var(--border);
		}
		.content {
			flex: 0 1 auto;
		}
	}
</style>
