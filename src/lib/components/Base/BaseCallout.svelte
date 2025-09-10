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
