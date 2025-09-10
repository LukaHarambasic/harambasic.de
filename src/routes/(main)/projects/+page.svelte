<script lang="ts">
	import type { PageData } from './$types';
	import { filterAndSort } from '$lib/data/projects/helper';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import Icon from '@iconify/svelte';

	// TODO: remove eager and only load images that got randomly selected
	const pictures = import.meta.glob(
		'../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../../assets/img/projects/${name}`];
		if (!image) {
			return {};
		}
		return (image as any).default || {};
	};

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const [entries] = data.projects;

	let filteredAndSorted = $derived(
		filterAndSort(entries, 'all', 'all', SORT_DEFAULTS.PROJECT, SortDirection.Desc)
	);
</script>

<Entries path={data.url}>
	{#snippet entries()}
		<div class="entries">
			{#each filteredAndSorted as entry, index}
				<a
					href={entry.relativePath}
					class="h-feed entry card no-spacing"
					data-highlighted={index < 3}
				>
					<enhanced:img
						src={getImage(entry.image)}
						sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
						alt={entry.title}
					/>
					<div class="content">
						<strong>{entry.title}</strong>
						<p>{entry.description}</p>
						<ul class="tags">
							{#each entry.tags as tag}
								<li>
									<BaseTag {tag} />
								</li>
							{/each}
						</ul>
					</div>
					<Icon class="arrow" icon="ph:arrow-circle-right-bold" />
				</a>
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
		.entry {
			display: flex;
			position: relative;
			height: 100%;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			color: var(--c-font);
			text-decoration: none;
			transition: var(--transition);
			@media screen and (width <= 62rem) {
				grid-column: span 1;
			}
			&[data-highlighted='false'] {
				display: flex;
				flex-direction: row;
				gap: 0;
				grid-column: span 3;
				@media screen and (width <= 32rem) {
					flex-direction: column;
				}
				> picture {
					width: 12rem;
					height: 12rem;
					@media screen and (width <= 32rem) {
						width: 100%;
						height: auto;
					}
					img {
						opacity: 0.5;
						width: inherit;
						height: inherit;
						border-radius: var(--border-radius) 0 0 var(--border-radius);
						aspect-ratio: 1 / 1;
						filter: grayscale(1);
						@media screen and (width <= 32rem) {
							border-radius: var(--border-radius) var(--border-radius) 0 0;
						}
					}
				}
				> .content {
					display: flex;
					padding: var(--l);
					flex-direction: column;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-items: stretch;
					align-content: stretch;
				}
			}
			&[data-highlighted='true'] {
				grid-column: span 2;
				> picture {
					width: 100%;
					img {
						opacity: 0.5;
						width: 100%;
						height: inherit;
						border-radius: var(--border-radius) var(--border-radius) 0 0;
						aspect-ratio: 1 / 1;
						filter: grayscale(1);
					}
				}
			}
			&:hover {
				transform: scale(0.97);
				cursor: pointer;
				> picture {
					source,
					img {
						filter: grayscale(0);
						opacity: 1;
					}
				}
				:global(.arrow) {
					opacity: 1;
				}
			}

			> .content {
				display: flex;
				padding: var(--l);
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: stretch;
				align-content: flex-start;
				text-align: left;
				strong {
					margin: 0 0 var(--xs) 0;
					font-family: var(--font-family);
					font-size: var(--font-m);
					font-weight: 900;
					line-height: 1.2;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				p {
					margin: 0 0 var(--s) 0;
					font-size: var(--font-m);
					line-height: 1.5;
				}
				.tags {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: flex-start;
					align-content: flex-start;
					gap: var(--xs);
				}
			}
			:global(.arrow) {
				opacity: 0;
				position: absolute;
				top: var(--m);
				right: calc((-1) * var(--m));
				size: var(--l);
				border: 4px solid var(--c-light);
				border-radius: 100%;
				box-shadow:
					0 1px 2px rgba(0, 0, 0, 0.03),
					0 2px 4px rgba(0, 0, 0, 0.03),
					0 4px 8px rgba(0, 0, 0, 0.03),
					0 8px 16px rgba(0, 0, 0, 0.03),
					0 16px 32px rgba(0, 0, 0, 0.03),
					0 32px 64px rgba(0, 0, 0, 0.03);
				background: var(--c-light);
				color: var(--c-font-accent-dark);
				transition: var(--transition);
			}
		}
	}
</style>
