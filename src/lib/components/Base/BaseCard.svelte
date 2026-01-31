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
	/* Base: standard card look (light), works as generic container for box usage */
	.base-card {
		display: flex;
		padding: var(--l);
		border: 1px solid var(--c-surface-accent);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		background: var(--c-light);
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: stretch;
		gap: var(--m);
		transition: var(--transition);
		@media screen and (width <= 42rem) {
			flex-direction: column;
		}
	}
	.base-card.noSpacing {
		padding: 0;
		gap: 0;
	}

	/* Link cards: no underline so content reads as card, not one big link */
	.base-card[href] {
		color: inherit;
		text-decoration: none;
	}
	.base-card[href]:hover {
		text-decoration: none;
		transform: scale(1.02) translateY(-4px);
		cursor: pointer;
	}

	/* Featured variant: dark Electricity Maps style */
	.base-card.featured {
		position: relative;
		height: 100%;
		border-color: rgba(255, 255, 255, 0.2);
		background: var(--c-current-work-bg);
		color: var(--c-current-work-text);
	}
	.base-card.featured[href] {
		color: inherit;
		text-decoration: none;
	}
	.base-card.featured[href]:hover {
		transform: scale(1.02) translateY(-4px);
		cursor: pointer;
	}
	.base-card.featured :global(strong),
	.base-card.featured :global(time),
	.base-card.featured :global(p) {
		color: inherit;
		text-decoration: none;
	}
	.base-card.featured :global(time),
	.base-card.featured :global(p) {
		opacity: 0.9;
		color: var(--c-current-work-text);
	}

	/* Link icon: top-right, no border */
	.base-card[href] :global(.card-link),
	.base-card[href] :global(.external-link) {
		display: flex;
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		color: var(--c-font);
		transition: var(--transition);
		pointer-events: none;
	}
	.base-card[href] :global(.card-link :global(svg)),
	.base-card[href] :global(.external-link :global(svg)) {
		width: 1rem;
		height: 1rem;
	}
	.base-card.featured[href] :global(.card-link),
	.base-card.featured[href] :global(.external-link) {
		color: var(--c-current-work-text);
	}
	.base-card.featured[href]:hover :global(.card-link),
	.base-card.featured[href]:hover :global(.external-link) {
		transform: translateY(-2px) translateX(2px);
	}
	.base-card[href]:hover :global(.card-link),
	.base-card[href]:hover :global(.external-link) {
		transform: translateY(-2px) translateX(2px);
	}

	/* --- Layout: withIcon (work & uses) — header (icon + title + subtitle), metadata, description, footer; link icon top-right */
	.base-card.withIcon {
		display: flex;
		position: relative;
		flex-direction: column;
		gap: 0;
	}
	.base-card.withIcon.noSpacing {
		padding: 0;
	}
	.base-card.withIcon[href] :global(.external-link) {
		position: absolute;
		top: var(--l);
		right: var(--l);
		z-index: 10;
	}
	.base-card.withIcon.noSpacing[href] :global(.external-link) {
		top: var(--m);
		right: var(--m);
	}
	.base-card.withIcon :global(.card-header) {
		display: flex;
		margin-bottom: var(--m);
		padding-right: calc(1.5rem + var(--xs));
		justify-content: flex-start;
		align-items: flex-start;
		gap: var(--m);
	}
	.base-card.withIcon :global(.header-content) {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: var(--xs);
	}
	.base-card.withIcon :global(.company-header) {
		display: flex;
		align-items: center;
		gap: var(--m);
	}

	/* Logo box: match old /work cards — 3rem square, no padding, flex center */
	.base-card.withIcon :global(.card-icon),
	.base-card.withIcon :global(.company-logo) {
		display: flex;
		width: 3rem;
		height: 3rem;
		border-radius: var(--border-radius-small);
		background: var(--c-font-accent-super-light);
		flex-shrink: 0;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	/* Picture/img: match work page — img and enhanced-img only, same rules as .company-logo in work +page */
	.base-card.withIcon :global(.card-icon img),
	.base-card.withIcon :global(.card-icon enhanced-img),
	.base-card.withIcon :global(.company-logo img),
	.base-card.withIcon :global(.company-logo enhanced-img) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.base-card.featured.withIcon :global(.card-icon),
	.base-card.featured.withIcon :global(.company-logo) {
		background: rgba(255, 255, 255, 0.1);
	}
	.base-card.withIcon :global(.company-info) {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0;
	}
	.base-card.withIcon :global(.card-title),
	.base-card.withIcon :global(.company-name) {
		margin: 0;
		color: var(--c-font);
		font-family: var(--font-family);
		font-size: var(--font-xl);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.featured.withIcon :global(.card-title),
	.base-card.featured.withIcon :global(.company-name) {
		color: var(--c-current-work-text);
		font-size: 1.5rem;
	}
	.base-card.withIcon :global(.card-subtitle),
	.base-card.withIcon :global(.card-location) {
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
		line-height: 1.5;
		white-space: nowrap;
	}
	.base-card.featured.withIcon :global(.card-subtitle),
	.base-card.featured.withIcon :global(.card-location) {
		color: rgba(255, 255, 255, 0.8);
	}
	.base-card.withIcon :global(.card-metadata) {
		margin-bottom: var(--m);
		width: 100%;
		min-width: 0;
	}
	.base-card.withIcon :global(.card-positions) {
		display: flex;
		width: 100%;
		min-width: 0;
		flex-direction: column;
		gap: var(--xs);
	}
	.base-card.withIcon :global(.position-row) {
		display: grid;
		width: 100%;
		align-items: baseline;
		gap: var(--m);
		grid-template-columns: 1fr auto;
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		line-height: 1.5;
	}
	.base-card.featured.withIcon :global(.position-row) {
		color: rgba(255, 255, 255, 0.8);
	}
	.base-card.withIcon :global(.position-title) {
		min-width: 0;
		font-weight: 500;
	}
	.base-card.withIcon :global(.position-dates) {
		color: var(--c-font-accent-dark);
		font-weight: 400;
		white-space: nowrap;
	}
	.base-card.featured.withIcon :global(.position-dates) {
		color: rgba(255, 255, 255, 0.8);
	}
	.base-card.withIcon :global(.card-description) {
		margin-bottom: var(--m);
	}
	.base-card.withIcon :global(.card-description p) {
		margin: 0;
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 400;
		line-height: 1.5;
	}
	.base-card.featured.withIcon :global(.card-description p) {
		color: var(--c-current-work-text);
	}
	.base-card.withIcon :global(.card-footer) {
		display: block;
		margin-top: auto;
		padding-top: var(--m);
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--c-surface-accent);
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		line-height: 1.5;
	}
	.base-card.featured.withIcon :global(.card-footer) {
		border-top-color: rgba(255, 255, 255, 0.2);
		color: var(--c-current-work-text);
	}
	.base-card.withIcon :global(.card-footer .project-row) {
		display: block;
		width: 100%;
	}
	.base-card.withIcon.noSpacing :global(.card-header) {
		margin: var(--l);
		margin-bottom: var(--m);
		padding: 0;
	}
	.base-card.withIcon.noSpacing :global(.card-metadata) {
		margin-right: var(--l);
		margin-left: var(--l);
	}
	.base-card.withIcon.noSpacing :global(.card-description) {
		margin-right: var(--l);
		margin-left: var(--l);
	}

	/* noSpacing: card has padding 0; footer stays full width with inner padding */
	.base-card.withIcon.noSpacing :global(.card-footer) {
		margin-right: 0;
		margin-left: 0;
		padding-right: var(--l);
		padding-left: var(--l);
	}

	/* --- Layout: withLogo (legacy, same structure as withIcon for migration) — 3rem icon in header */
	.base-card.withLogo {
		display: flex;
		padding: var(--l);
		flex-direction: column;
		gap: 0;
	}
	.base-card.withLogo.noSpacing {
		padding: 0;
	}
	.base-card.withLogo :global(.card-header) {
		display: flex;
		margin-bottom: var(--m);
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--m);
	}
	.base-card.withLogo :global(.card-icon),
	.base-card.withLogo :global(.logo) {
		display: flex;
		width: 3rem;
		height: 3rem;
		border-radius: var(--border-radius-small);
		background: var(--c-font-accent-super-light);
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	.base-card.withLogo :global(.card-icon img),
	.base-card.withLogo :global(.card-icon enhanced-img),
	.base-card.withLogo :global(.logo img),
	.base-card.withLogo :global(.logo enhanced-img) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.base-card.withLogo :global(.content) {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: var(--xs);
	}
	.base-card.withLogo :global(.content .title strong),
	.base-card.withLogo :global(.content strong) {
		display: inline;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.withLogo :global(.content p) {
		margin: 0;
		font-size: var(--font-m);
		line-height: 1.2;
	}

	/* --- Layout: text (minimal block for home teasers) */
	.base-card.text {
		position: relative;
		flex-direction: column;
	}
	.base-card.text :global(.external-link) {
		position: absolute;
		top: var(--m);
		right: var(--m);
		z-index: 10;
	}
	.base-card.text :global(strong) {
		display: block;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.text :global(time) {
		display: inline-block;
		margin: 0 0 var(--xs) 0;
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
	}
	.base-card.text :global(p) {
		margin: var(--xs) 0 0 0;
		font-size: var(--font-m);
		line-height: 1.5;
	}

	/* --- Layout: row (posts list — title+tags left, date right) */
	.base-card.row {
		position: relative;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		@media screen and (width <= 50rem) {
			flex-direction: column-reverse;
		}
	}
	.base-card.row :global(.external-link) {
		position: absolute;
		top: var(--m);
		right: var(--m);
		z-index: 10;
	}
	.base-card.row :global(.column) {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--xs);
	}
	.base-card.row :global(.column .title) {
		display: inline-block;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.row :global(.column .tags) {
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
	.base-card.row :global(time) {
		flex-shrink: 0;
		text-align: right;
		@media screen and (width <= 50rem) {
			margin: 0 0 calc(-1 * var(--m));
			flex-shrink: 1;
		}
	}

	/* --- Layout: contentOnly (uses archive) */
	.base-card.contentOnly {
		display: flex;
		position: relative;
		flex-direction: column;
		grid-template-areas: unset;
		grid-template-columns: unset;
	}
	.base-card.contentOnly :global(.content) {
		display: flex;
		padding: var(--l);
		padding-right: calc(var(--l) + 1.5rem + var(--xs));
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--xs);
	}
	.base-card.contentOnly :global(.external-link) {
		position: absolute;
		top: var(--l);
		right: var(--l);
	}
	.base-card.contentOnly :global(.content .title strong) {
		display: inline;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.contentOnly :global(.content p) {
		font-size: var(--font-m);
		line-height: 1.2;
	}

	/* --- Layout: withImage (projects) — image area + content */
	.base-card.image {
		position: relative;
		padding: 0;
		flex-direction: row;
		align-items: stretch;
		gap: 0;
		overflow: hidden;
		@media screen and (width <= 32rem) {
			flex-direction: column;
		}
	}
	.base-card.image :global(.external-link) {
		position: absolute;
		top: var(--m);
		right: var(--m);
		z-index: 10;
	}
	.base-card.image:hover :global(.image-wrapper),
	.base-card.image:hover :global(picture),
	.base-card.image:hover :global(picture source),
	.base-card.image:hover :global(picture img),
	.base-card.image:hover :global(.image-wrapper .main-img img) {
		filter: grayscale(0);
		opacity: 1;
	}
	.base-card.image :global(.content) {
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
	.base-card.image :global(.content strong) {
		margin: 0 0 var(--xs) 0;
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.base-card.image :global(.content p) {
		margin: 0;
		color: var(--c-font-accent-dark);
		font-size: var(--font-m);
		font-weight: 400;
		line-height: 1.5;
	}

	/* withImage: generic (picture + .content) */
	.base-card.image :global(picture) {
		width: 12rem;
		height: 12rem;
	}
	@media screen and (width <= 32rem) {
		.base-card.image :global(picture) {
			width: 100%;
			height: auto;
		}
	}
	.base-card.image :global(picture img) {
		opacity: 0.9;
		width: inherit;
		height: inherit;
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		aspect-ratio: 1 / 1;
		filter: grayscale(1);
		transition:
			filter var(--transition),
			opacity var(--transition);
	}
	@media screen and (width <= 32rem) {
		.base-card.image :global(picture img) {
			border-radius: var(--border-radius) var(--border-radius) 0 0;
		}
	}

	/* withImage highlighted: image full-width top */
	.base-card.image.highlighted {
		flex-direction: column;
		align-items: stretch;
	}
	.base-card.image.highlighted :global(.image-wrapper) {
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
	.base-card.image.highlighted :global(.image-wrapper .blur-bg) {
		display: none;
	}
	.base-card.image.highlighted :global(.image-wrapper .main-img) {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.base-card.image.highlighted :global(.image-wrapper .main-img picture) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
	}
	.base-card.image.highlighted :global(.image-wrapper .main-img img) {
		display: block;
		opacity: 0.9;
		margin: 0;
		padding: 0;
		width: 100% !important;
		max-width: 100%;
		height: auto !important;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		object-fit: cover;
		object-position: center;
		filter: grayscale(1);
		transition:
			filter var(--transition),
			opacity var(--transition);
	}
	.base-card.image.highlighted:hover :global(.image-wrapper) {
		filter: grayscale(0);
	}
	.base-card.image.highlighted:hover :global(.image-wrapper .main-img img) {
		filter: grayscale(0);
		opacity: 1;
	}
	.base-card.image.highlighted :global(.content) {
		text-align: left;
	}
	.base-card.image.highlighted :global(.content strong) {
		margin: 0 0 var(--xs) 0;
	}
	.base-card.image.highlighted :global(.content p) {
		margin: 0 0 var(--s) 0;
	}
	.base-card.image.highlighted :global(.content .tags) {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		gap: var(--xs);
	}

	/* withImage compact: image left, content right */
	.base-card.image.compact {
		flex-direction: row;
		align-items: stretch;
		overflow: hidden;
		@media screen and (width <= 32rem) {
			flex-direction: column;
		}
	}
	.base-card.image.compact :global(.image-wrapper) {
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
		.base-card.image.compact :global(.image-wrapper) {
			width: 100%;
			min-width: 0;
			min-height: 0;
			aspect-ratio: 16 / 10;
			border-radius: var(--border-radius) var(--border-radius) 0 0;
		}
	}
	.base-card.image.compact :global(.image-wrapper .blur-bg) {
		position: absolute;
		z-index: 1;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		inset: 0;
	}
	.base-card.image.compact :global(.image-wrapper .blur-bg picture),
	.base-card.image.compact :global(.image-wrapper .blur-bg img) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		transform: scale(1.1);
		object-fit: cover;
		filter: blur(12px) brightness(0.9);
	}
	.base-card.image.compact :global(.image-wrapper .main-img) {
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
	.base-card.image.compact :global(.image-wrapper .main-img picture) {
		display: block;
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
	}
	.base-card.image.compact :global(.image-wrapper .main-img img) {
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
		.base-card.image.compact :global(.image-wrapper .blur-bg) {
			display: none;
		}
		.base-card.image.compact :global(.image-wrapper .main-img) {
			width: 100%;
			height: auto;
			min-height: 0;
			border-radius: 0;
			box-shadow: none;
			aspect-ratio: 16 / 10;
		}
		.base-card.image.compact :global(.image-wrapper .main-img img) {
			height: 100%;
			min-height: 0;
			border-radius: var(--border-radius) var(--border-radius) 0 0;
			object-fit: cover;
		}
	}
	.base-card.image.compact:hover :global(.image-wrapper) {
		filter: grayscale(0);
	}
	.base-card.image.compact:hover :global(.image-wrapper .main-img img) {
		opacity: 1;
	}
	.base-card.image.compact :global(.content) {
		text-align: left;
	}
	.base-card.image.compact :global(.content strong) {
		margin: 0 0 var(--xs) 0;
	}
	.base-card.image.compact :global(.content p) {
		margin: 0 0 var(--s) 0;
	}
	.base-card.image.compact :global(.content .tags) {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		gap: var(--xs);
	}
</style>
