<script lang="ts">
	import { resolvePath } from '$lib/util/paths';
	import type { PageData } from './$types';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import Icon from '@iconify/svelte';
	import { getProjectImage } from '$lib/util/enhancedImages';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let entries = $derived(data.projects[0] ?? []);

	let filteredAndSorted = $derived(
		filterAndSort(entries, 'all', 'all', SORT_DEFAULTS.PROJECT, SortDirection.Desc)
	);
</script>

<Entries>
	{#snippet entries()}
		<div class="entries">
			{#each filteredAndSorted as entry, index (entry.slug)}
				{@const imageData = getProjectImage(entry.image)}
				<div class="entry-wrapper" data-highlighted={index < 3}>
					<BaseCard
						element="a"
						href={resolvePath(entry.relativePath)}
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

				/* Highlighted-only: desktop = column (image on top), tablet = row, small = column */
				:global(.base-card.image.highlighted) {
					@media screen and (width > 62rem) {
						flex-direction: column;
						align-items: stretch;
						overflow: hidden;

						:global(.image-wrapper) {
							width: 100%;
							min-width: 0;
							min-height: 0;
							border-radius: var(--border-radius) var(--border-radius) 0 0;
							aspect-ratio: 16 / 10;
						}

						:global(.main-img) {
							width: 100%;
							height: auto;
							min-height: 0;
							border-radius: 0;
							box-shadow: none;
							aspect-ratio: 16 / 10;
						}

						:global(.main-img img) {
							height: 100%;
							min-height: 0;
							border-radius: var(--border-radius) var(--border-radius) 0 0;
							object-fit: cover;
							object-position: top;
						}
					}

					@media screen and (width <= 62rem) {
						flex-direction: row;
						align-items: stretch;
						overflow: hidden;
					}

					@media screen and (width <= 32rem) {
						flex-direction: column;
					}

					&:hover {
						@media screen and (width > 62rem) {
							:global(.image-wrapper) {
								filter: grayscale(0);
							}

							:global(.main-img img) {
								opacity: 1;
							}
						}

						@media screen and (width <= 62rem) {
							:global(.image-wrapper) {
								filter: grayscale(0);
							}

							:global(.main-img img) {
								opacity: 1;
							}
						}
					}
				}
			}

			&[data-highlighted='false'] {
				grid-column: span 3;
			}

			> :global(.base-card) {
				min-height: 0;
				flex: 1 1 auto;
			}
		}

		/* Shared: image card layout and image styling (highlighted + compact), usage-specific */
		:global(.base-card.image.highlighted),
		:global(.base-card.image.compact) {
			flex-direction: row;
			align-items: stretch;
			overflow: hidden;

			@media screen and (width <= 32rem) {
				flex-direction: column;
			}

			:global(.image-wrapper) {
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

				@media screen and (width <= 32rem) {
					width: 100%;
					min-width: 0;
					min-height: 0;
					aspect-ratio: 16 / 10;
					border-radius: var(--border-radius) var(--border-radius) 0 0;
				}

				:global(.blur-bg) {
					position: absolute;
					z-index: 1;
					margin: 0;
					padding: 0;
					width: 100%;
					height: 100%;
					inset: 0;

					@media screen and (width <= 32rem) {
						display: none;
					}

					:global(picture),
					:global(img) {
						margin: 0;
						padding: 0;
						width: 100%;
						height: 100%;
						object-fit: cover;
						transform: scale(1.1);
						filter: blur(12px) brightness(0.9);
					}
				}

				:global(.main-img) {
					position: absolute;
					z-index: 2;
					margin: 0;
					padding: 0;
					width: 100%;
					height: 100%;
					border-radius: var(--border-radius) 0 0 var(--border-radius);
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
					inset: 0;

					@media screen and (width <= 32rem) {
						width: 100%;
						height: auto;
						min-height: 0;
						border-radius: 0;
						box-shadow: none;
						aspect-ratio: 16 / 10;
					}

					:global(picture) {
						display: block;
						margin: 0;
						padding: 0;
						width: 100%;
						height: 100%;
					}

					:global(img) {
						display: block;
						margin: 0;
						padding: 0;
						width: 100% !important;
						max-width: 100%;
						height: 100% !important;
						border-radius: var(--border-radius) 0 0 var(--border-radius);
						object-fit: cover;
						object-position: top;
					}

					@media screen and (width <= 32rem) {
						:global(img) {
							height: 100%;
							min-height: 0;
							border-radius: var(--border-radius) var(--border-radius) 0 0;
							object-fit: cover;
							object-position: top;
						}
					}
				}
			}

			:global(.content) {
				text-align: left;

				:global(strong) {
					margin: 0 0 var(--xs) 0;
				}

				:global(p) {
					margin: 0 0 var(--s) 0;
				}
			}
		}

		/* Compact only: hover at all viewports */
		:global(.base-card.image.compact) {
			&:hover {
				:global(.image-wrapper) {
					filter: grayscale(0);
				}

				:global(.main-img img) {
					opacity: 1;
				}
			}
		}
	}
</style>
