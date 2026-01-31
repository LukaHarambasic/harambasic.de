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

	/* Featured image sub-variant: whole card has no padding */
	.base-card.featured.image {
		padding: 0;
		gap: 0;
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
		margin: var(--l);
		padding: 0;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
	}

	/* Featured row sub-variant: posts list (title+tags left, date right) */
	.base-card.featured.row {
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		@media screen and (width <= 50rem) {
			flex-direction: column-reverse;
		}
	}
	.base-card.featured.row :global(.column) {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--xs);
	}
	.base-card.featured.row :global(.column .title) {
		display: inline-block;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.featured.row :global(.column .tags) {
		display: flex;
		flex-grow: 1;
		flex-basis: 100%;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: stretch;
		gap: var(--xs);
	}
	.base-card.featured.row :global(time) {
		flex-shrink: 0;
		text-align: right;
		@media screen and (width <= 50rem) {
			margin: 0 0 calc(-1 * var(--m));
			flex-shrink: 1;
		}
	}

	/* Featured withLogo sub-variant: uses list (logo + content) */
	.base-card.featured.withLogo {
		display: grid;
		row-gap: var(--xl);
		grid-template-areas: 'logo content';
		grid-template-rows: auto;
		grid-template-columns: 8rem 1fr;
	}
	.base-card.featured.withLogo :global(.logo) {
		display: flex;
		margin: 0;
		padding: 0;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		background: var(--c-font-accent-super-light);
		justify-content: center;
		align-items: center;
		grid-area: logo;
		overflow: hidden;
	}
	.base-card.featured.withLogo :global(.logo img) {
		width: 100%;
		height: 4rem;
		object-fit: contain;
	}
	.base-card.featured.withLogo :global(.content) {
		display: flex;
		padding: var(--l);
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--xs);
		grid-area: content;
	}
	.base-card.featured.withLogo :global(.content .title strong) {
		display: inline;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.featured.withLogo :global(.content p) {
		font-size: var(--font-m);
		line-height: 1.2;
	}

	/* Featured contentOnly sub-variant: uses archive (content only) */
	.base-card.featured.contentOnly {
		display: grid;
		grid-template-areas: 'content';
		grid-template-columns: 1fr;
	}
	.base-card.featured.contentOnly :global(.content) {
		display: flex;
		padding: var(--l);
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--xs);
		grid-area: content;
	}
	.base-card.featured.contentOnly :global(.content .title strong) {
		display: inline;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.featured.contentOnly :global(.content p) {
		font-size: var(--font-m);
		line-height: 1.2;
	}

	/* Featured image highlighted: projects first 3 (image full-width top, edge-to-edge) */
	.base-card.featured.image.highlighted {
		flex-direction: column;
		align-items: stretch;
		overflow: hidden;
	}
	.base-card.featured.image.highlighted :global(.image-wrapper) {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		width: 100%;
		min-width: 0;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		align-self: stretch;
		transition: filter var(--transition);
		overflow: hidden;
		filter: grayscale(1);
	}
	.base-card.featured.image.highlighted :global(.image-wrapper .blur-bg) {
		display: none;
	}
	.base-card.featured.image.highlighted :global(.image-wrapper .main-img) {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.base-card.featured.image.highlighted :global(.image-wrapper .main-img picture) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.base-card.featured.image.highlighted :global(.image-wrapper .main-img img) {
		display: block;
		opacity: 0.5;
		margin: 0;
		padding: 0;
		width: 100% !important;
		max-width: 100%;
		height: auto !important;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		object-fit: cover;
		object-position: center;
		filter: grayscale(1);
	}
	.base-card.featured.image.highlighted:hover :global(.image-wrapper) {
		filter: grayscale(0);
	}
	.base-card.featured.image.highlighted:hover :global(.image-wrapper .main-img img) {
		filter: grayscale(0);
		opacity: 1;
	}
	.base-card.featured.image.highlighted :global(.content) {
		text-align: left;
	}
	.base-card.featured.image.highlighted :global(.content strong) {
		margin: 0 0 var(--xs) 0;
	}
	.base-card.featured.image.highlighted :global(.content p) {
		margin: 0 0 var(--s) 0;
	}
	.base-card.featured.image.highlighted :global(.content .tags) {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		gap: var(--xs);
	}

	/* Featured image compact: projects rest (image left, content right, edge-to-edge) */
	.base-card.featured.image.compact {
		flex-direction: row;
		align-items: stretch;
		overflow: hidden;
		@media screen and (width <= 32rem) {
			flex-direction: column;
		}
	}
	.base-card.featured.image.compact :global(.image-wrapper) {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		width: 12rem;
		min-width: 12rem;
		min-height: 12rem;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		align-self: stretch;
		transition: filter var(--transition);
		overflow: hidden;
		box-sizing: border-box;
		filter: grayscale(1);
	}
	@media screen and (width <= 32rem) {
		.base-card.featured.image.compact :global(.image-wrapper) {
			width: 100%;
			min-width: 0;
			min-height: 0;
			aspect-ratio: 16 / 10;
			border-radius: var(--border-radius) var(--border-radius) 0 0;
		}
	}
	.base-card.featured.image.compact :global(.image-wrapper .blur-bg) {
		position: absolute;
		z-index: 1;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		inset: 0;
	}
	.base-card.featured.image.compact :global(.image-wrapper .blur-bg picture),
	.base-card.featured.image.compact :global(.image-wrapper .blur-bg img) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.1);
		object-fit: cover;
		filter: blur(12px) brightness(0.9);
	}
	.base-card.featured.image.compact :global(.image-wrapper .main-img) {
		position: absolute;
		z-index: 2;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		inset: 0;
	}
	.base-card.featured.image.compact :global(.image-wrapper .main-img picture) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	.base-card.featured.image.compact :global(.image-wrapper .main-img img) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100% !important;
		max-width: 100%;
		height: 100% !important;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		object-fit: cover;
		object-position: center;
	}
	@media screen and (width <= 32rem) {
		.base-card.featured.image.compact :global(.image-wrapper .blur-bg) {
			display: none;
		}
		.base-card.featured.image.compact :global(.image-wrapper .main-img) {
			width: 100%;
			height: auto;
			min-height: 0;
			border-radius: 0;
			box-shadow: none;
			aspect-ratio: 16 / 10;
		}
		.base-card.featured.image.compact :global(.image-wrapper .main-img img) {
			height: 100%;
			min-height: 0;
			border-radius: var(--border-radius) var(--border-radius) 0 0;
			object-fit: cover;
		}
	}
	.base-card.featured.image.compact:hover :global(.image-wrapper) {
		filter: grayscale(0);
	}
	.base-card.featured.image.compact:hover :global(.image-wrapper .main-img img) {
		opacity: 1;
	}
	.base-card.featured.image.compact :global(.content) {
		text-align: left;
	}
	.base-card.featured.image.compact :global(.content strong) {
		margin: 0 0 var(--xs) 0;
	}
	.base-card.featured.image.compact :global(.content p) {
		margin: 0 0 var(--s) 0;
	}
	.base-card.featured.image.compact :global(.content .tags) {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		gap: var(--xs);
	}
</style>
