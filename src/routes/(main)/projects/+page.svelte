<script lang="ts">
	import type { PageData } from './$types';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import Icon from '@iconify/svelte';
	import { getImageFromGlob, type ImageGlobResult } from '$lib/util/images';

	// TODO: remove eager and only load images that got randomly selected
	const pictures: ImageGlobResult = import.meta.glob(
		'../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const PROJECT_IMAGE_PATH = '../../../assets/img/projects/';

	const getImage = (name: string) => getImageFromGlob(pictures, PROJECT_IMAGE_PATH, name);

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let entries = $derived(data.projects[0]);

	let filteredAndSorted = $derived(
		filterAndSort(entries, 'all', 'all', SORT_DEFAULTS.PROJECT, SortDirection.Desc)
	);
</script>

<Entries>
	{#snippet entries()}
		<div class="entries">
			{#each filteredAndSorted as entry, index}
				{@const imageData = getImage(entry.image)}
				<div class="entry-wrapper" data-highlighted={index < 3}>
					<BaseCard
						element="a"
						href={entry.relativePath}
						variant="default"
						class="image noSpacing {index < 3 ? 'highlighted' : 'compact'}"
					>
						<div class="external-link">
							<Icon icon="ph:arrow-up-right-bold" />
						</div>
						{#if imageData}
							<div class="image-wrapper">
								<div class="blur-bg">
									<enhanced:img
										src={imageData}
										sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
										alt={entry.title}
									/>
								</div>
								<div class="main-img">
									<enhanced:img
										src={imageData}
										sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
										alt={entry.title}
									/>
								</div>
							</div>
						{/if}
						<div class="content">
							<strong>{entry.title}</strong>
							<p>{entry.description}</p>
						</div>
					</BaseCard>
				</div>
			{/each}
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.entries {
		display: grid;
		gap: var(--l);
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		@media screen and (width <= 62rem) {
			row-gap: var(--l);
			column-gap: 0;
			grid-template-columns: 1fr;
		}
		.entry-wrapper {
			display: flex;
			height: 100%;
			min-height: 0;
			flex-direction: column;
			@media screen and (width <= 62rem) {
				grid-column: span 1;
			}
			&[data-highlighted='true'] {
				grid-column: span 2;
			}
			&[data-highlighted='false'] {
				grid-column: span 3;
			}
			> :global(.base-card) {
				min-height: 0;
				flex: 1 1 auto;
			}
		}

		/* image.compact (non-highlighted cards) — usage-specific, moved from BaseCard */
		:global(.base-card.image.compact) {
			flex-direction: row;
			align-items: stretch;
			overflow: hidden;
			@media screen and (width <= 32rem) {
				flex-direction: column;
			}
		}
		:global(.base-card.image.compact .image-wrapper) {
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
			.entries :global(.base-card.image.compact .image-wrapper) {
				width: 100%;
				min-width: 0;
				min-height: 0;
				aspect-ratio: 16 / 10;
				border-radius: var(--border-radius) var(--border-radius) 0 0;
			}
		}
		:global(.base-card.image.compact .image-wrapper .blur-bg) {
			position: absolute;
			z-index: 1;
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			inset: 0;
		}
		:global(.base-card.image.compact .image-wrapper .blur-bg picture),
		:global(.base-card.image.compact .image-wrapper .blur-bg img) {
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			transform: scale(1.1);
			object-fit: cover;
			filter: blur(12px) brightness(0.9);
		}
		:global(.base-card.image.compact .image-wrapper .main-img) {
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
		:global(.base-card.image.compact .image-wrapper .main-img picture) {
			display: block;
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
		}
		:global(.base-card.image.compact .image-wrapper .main-img img) {
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
			.entries :global(.base-card.image.compact .image-wrapper .blur-bg) {
				display: none;
			}
			.entries :global(.base-card.image.compact .image-wrapper .main-img) {
				width: 100%;
				height: auto;
				min-height: 0;
				border-radius: 0;
				box-shadow: none;
				aspect-ratio: 16 / 10;
			}
			.entries :global(.base-card.image.compact .image-wrapper .main-img img) {
				height: 100%;
				min-height: 0;
				border-radius: var(--border-radius) var(--border-radius) 0 0;
				object-fit: cover;
			}
		}
		:global(.base-card.image.compact:hover .image-wrapper) {
			filter: grayscale(0);
		}
		:global(.base-card.image.compact:hover .image-wrapper .main-img img) {
			opacity: 1;
		}
		:global(.base-card.image.compact .content) {
			text-align: left;
		}
		:global(.base-card.image.compact .content strong) {
			margin: 0 0 var(--xs) 0;
		}
		:global(.base-card.image.compact .content p) {
			margin: 0 0 var(--s) 0;
		}
	}
</style>
