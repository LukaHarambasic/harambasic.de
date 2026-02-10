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
	/* Single root: all variants and slots nested under .base-card */
	.base-card {
		display: flex;
		padding: var(--l);
		border: 1px solid var(--c-surface-accent);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		background: color-mix(in srgb, var(--c-light) 75%, var(--c-surface));
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

		&.noSpacing {
			padding: 0;
			gap: 0;
		}

		&[href] {
			color: inherit;
			text-decoration: none;
		}
		&[href]:hover {
			text-decoration: none;
			transform: scale(1.02) translateY(-4px);
			cursor: pointer;
		}
		&[href] :global(.external-link) {
			display: flex;
			width: 1.5rem;
			height: 1.5rem;
			flex-shrink: 0;
			justify-content: center;
			align-items: center;
			color: var(--c-font-accent-super-light);
			transition: var(--transition);
			pointer-events: none;
		}
		&[href] :global(.external-link :global(svg)) {
			width: 1rem;
			height: 1rem;
		}
		&[href]:hover :global(.external-link) {
			color: var(--c-font);
			transform: translateY(-2px) translateX(2px);
		}

		/* Layout: withIcon (work & uses) */
		&.withIcon {
			display: flex;
			position: relative;
			flex-direction: column;
			gap: 0;

			&.noSpacing {
				padding: 0;
			}
			&[href] :global(.external-link) {
				position: absolute;
				top: var(--l);
				right: var(--l);
				z-index: 10;
			}
			&.noSpacing[href] :global(.external-link) {
				top: var(--l);
				right: var(--m);
			}
			:global(.header) {
				display: flex;
				margin-bottom: var(--m);
				padding-right: calc(1.5rem + var(--xs));
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--m);
			}
			:global(.logo) {
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
			:global(.logo img),
			:global(.logo enhanced-img) {
				display: block;
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
			:global(.info) {
				display: flex;
				min-width: 0;
				flex: 1;
				flex-direction: column;
				gap: 0;
			}
			:global(.name) {
				margin: 0;
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-xl);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			:global(.location) {
				color: var(--c-font-accent-dark);
				font-family: var(--font-family);
				font-size: var(--font-s);
				font-weight: 400;
				font-style: italic;
				line-height: 1.5;
				white-space: nowrap;
			}
			:global(.metadata) {
				width: 100%;
				min-width: 0;
			}
			:global(.positions) {
				display: flex;
				width: 100%;
				min-width: 0;
				flex-direction: column;
				gap: var(--xs);
			}
			:global(.row) {
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
			:global(.title) {
				min-width: 0;
				font-weight: 500;
			}
			:global(.dates) {
				color: var(--c-font-accent-dark);
				font-weight: 400;
				white-space: nowrap;
			}
			:global(.description) {
				margin-top: var(--m);
				margin-bottom: var(--m);
			}
			:global(.description p) {
				margin: 0;
				color: var(--c-font-accent-dark);
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 400;
				line-height: 1.5;
			}
			:global(.footer) {
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
			:global(.footer .row) {
				display: block;
				width: 100%;
			}
			&.noSpacing :global(.header) {
				margin: var(--l);
				margin-bottom: var(--m);
				padding: 0;
			}
			&.noSpacing :global(.metadata) {
				margin-right: var(--l);
				margin-left: var(--l);
			}
			&.noSpacing :global(.description) {
				margin-right: var(--l);
				margin-left: var(--l);
			}
			&.noSpacing :global(.footer) {
				margin-right: 0;
				margin-left: 0;
				padding-right: var(--l);
				padding-left: var(--l);
			}
		}

		/* Layout: withLogo (legacy) */
		&.withLogo {
			display: flex;
			padding: var(--l);
			flex-direction: column;
			gap: 0;

			&.noSpacing {
				padding: 0;
			}
			:global(.header) {
				display: flex;
				margin-bottom: var(--m);
				justify-content: space-between;
				align-items: flex-start;
				gap: var(--m);
			}
			:global(.logo) {
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
			:global(.logo img),
			:global(.logo enhanced-img) {
				display: block;
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
			:global(.content) {
				display: flex;
				min-width: 0;
				flex: 1;
				flex-direction: column;
				gap: var(--xs);
			}
			:global(.content .title strong),
			:global(.content strong) {
				display: inline;
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			:global(.content p) {
				margin: 0;
				font-size: var(--font-m);
				line-height: 1.2;
			}
		}

		/* Layout: row (posts list) */
		&.row {
			position: relative;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: flex-start;
			@media screen and (width <= 50rem) {
				flex-direction: column-reverse;
			}
			:global(.external-link) {
				position: absolute;
				top: var(--l);
				right: var(--m);
				z-index: 10;
			}
			:global(.column) {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: stretch;
				align-content: stretch;
				gap: var(--xs);
			}
			:global(.column .title) {
				display: inline-block;
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			:global(.column .tags) {
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
			:global(time) {
				flex-shrink: 0;
				text-align: right;
				@media screen and (width <= 50rem) {
					margin: 0 0 calc(-1 * var(--m));
					flex-shrink: 1;
				}
			}
		}

		/* Layout: image (projects) */
		&.image {
			position: relative;
			padding: 0;
			flex-direction: row;
			align-items: stretch;
			gap: 0;
			overflow: hidden;
			@media screen and (width <= 32rem) {
				flex-direction: column;
			}
			:global(.external-link) {
				position: absolute;
				top: var(--m);
				right: var(--m);
				z-index: 10;
			}
			&:hover :global(.image-wrapper),
			&:hover :global(picture),
			&:hover :global(picture source),
			&:hover :global(picture img),
			&:hover :global(.image-wrapper .main-img img) {
				filter: grayscale(0);
				opacity: 1;
			}
			:global(.content) {
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
			:global(.content strong) {
				margin: 0 0 var(--xs) 0;
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			:global(.content p) {
				margin: 0;
				color: var(--c-font-accent-dark);
				font-size: var(--font-m);
				font-weight: 400;
				line-height: 1.5;
			}
			:global(picture) {
				width: 12rem;
				height: 12rem;
			}
			@media screen and (width <= 32rem) {
				:global(picture) {
					width: 100%;
					height: auto;
				}
			}
			:global(picture img) {
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
				:global(picture img) {
					border-radius: var(--border-radius) var(--border-radius) 0 0;
				}
			}

			&.highlighted {
				flex-direction: column;
				align-items: stretch;
				:global(.image-wrapper) {
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
				:global(.image-wrapper .blur-bg) {
					display: none;
				}
				:global(.image-wrapper .main-img) {
					display: block;
					position: relative;
					margin: 0;
					padding: 0;
					width: 100%;
				}
				:global(.image-wrapper .main-img picture) {
					display: block;
					margin: 0;
					padding: 0;
					width: 100%;
				}
				:global(.image-wrapper .main-img img) {
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
				&:hover :global(.image-wrapper) {
					filter: grayscale(0);
				}
				&:hover :global(.image-wrapper .main-img img) {
					filter: grayscale(0);
					opacity: 1;
				}
				:global(.content) {
					text-align: left;
				}
				:global(.content strong) {
					margin: 0 0 var(--xs) 0;
				}
				:global(.content p) {
					margin: 0 0 var(--s) 0;
				}
				:global(.content .tags) {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: flex-start;
					align-content: flex-start;
					gap: var(--xs);
				}
			}
		}
	}
</style>
