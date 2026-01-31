<script lang="ts">
	type Variant = 'default' | 'featured';

	interface Props {
		class?: string;
		element?: 'div' | 'a';
		href?: string;
		noSpacing?: boolean;
		variant?: Variant;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	}

	let {
		class: className,
		element = 'div',
		href,
		noSpacing = false,
		variant = 'default',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={element}
	class="base-card {className ?? ''}"
	class:noSpacing
	class:featured={variant === 'featured'}
	href={element === 'a' ? href : undefined}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>

<style lang="postcss">
	/* Scoped to component root so styles always apply (reset.css sets a { padding: 0; border: 0 }) */
	.base-card {
		display: flex;
		padding: var(--l);
		border: var(--border);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		background: var(--c-surface);
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: stretch;
		gap: var(--m);
		@media screen and (width <= 42rem) {
			flex-direction: column;
		}
	}
	.base-card.noSpacing {
		padding: 0;
		gap: 0;
	}

	/* Featured variant */
	.base-card.featured {
		position: relative;
		height: 100%;
		transition: var(--transition);
	}
	.base-card.featured[href] {
		color: var(--c-font);
		text-decoration: none;
	}
	.base-card.featured :global(strong),
	.base-card.featured :global(time),
	.base-card.featured :global(p) {
		text-decoration: none;
	}
	.base-card.featured :global(time),
	.base-card.featured :global(p) {
		color: var(--c-font-accent-dark);
	}
	.base-card.featured:hover {
		transform: scale(0.97);
		cursor: pointer;
	}
	.base-card.featured:hover :global(svg) {
		opacity: 1;
	}
	.base-card.featured :global(svg) {
		opacity: 0;
		position: absolute;
		top: var(--m);
		right: calc(-1 * var(--m));
		z-index: 1000;
		size: var(--l);
		border: 4px solid var(--c-light);
		border-radius: 100%;
		background: var(--c-light);
		transition: var(--transition);
	}
	.base-card.featured :global(strong) {
		display: block;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.featured :global(time) {
		display: inline-block;
		margin: 0 0 var(--xs) 0;
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
	}
	.base-card.featured :global(p) {
		margin: var(--xs) 0 0 0;
		font-size: var(--font-m);
		line-height: 1.5;
	}

	/* Featured text sub-variant: stack title and date/description */
	.base-card.featured.text {
		flex-direction: column;
	}

	/* Featured image sub-variant */
	.base-card.featured.image {
		@media screen and (width <= 32rem) {
			flex-direction: column;
		}
	}
	.base-card.featured.image:hover :global(picture),
	.base-card.featured.image:hover :global(picture source),
	.base-card.featured.image:hover :global(picture img) {
		filter: grayscale(0);
		opacity: 1;
	}
	.base-card.featured.image :global(picture) {
		width: 12rem;
		height: 12rem;
	}
	@media screen and (width <= 32rem) {
		.base-card.featured.image :global(picture) {
			width: 100%;
			height: auto;
		}
	}
	.base-card.featured.image :global(picture img) {
		opacity: 0.5;
		width: inherit;
		height: inherit;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		aspect-ratio: 1 / 1;
		filter: grayscale(1);
	}
	@media screen and (width <= 32rem) {
		.base-card.featured.image :global(picture img) {
			border-radius: var(--border-radius) var(--border-radius) 0 0;
		}
	}
	.base-card.featured.image :global(.content) {
		display: flex;
		padding: var(--l);
		min-width: 0;
		flex: 1;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
	}
</style>
