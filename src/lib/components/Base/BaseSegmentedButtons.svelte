<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="segmented-buttons">
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="postcss">
	.segmented-buttons {
		display: flex;
		border: var(--border);
		border-radius: var(--border-radius-small);
		background: var(--c-surface);
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		align-content: stretch;
		overflow: hidden;
		@media screen and (width <= 30rem) {
			width: 100%;
			flex-direction: column;
		}
		> :global(*) {
			margin: 0;
			padding: var(--xs) var(--s);
			border: none;
			border-right: 1px solid var(--c-surface-accent);
			background: transparent;
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 500;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
			text-align: center;
			text-decoration: none;
			transition: var(--transition);
			&:hover {
				border-right: 1px transparent solid;
				background: var(--c-surface-accent);
				cursor: pointer;
			}
			&:last-child {
				border-right: none;
			}
			@media screen and (width <= 30rem) {
				width: 100%;
				border-right: none;
				&:not(:last-child) {
					border-bottom: 1px solid var(--c-surface-accent);
				}
			}
		}
	}
</style>
