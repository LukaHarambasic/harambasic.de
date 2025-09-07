<script lang="ts">
	import type { PageData } from './$types';
	import { filterAndSort } from '$lib/data/projects/helper';
	import { ProjectStatus, SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
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
		filterAndSort(entries, 'all', ProjectStatus.All, SORT_DEFAULTS.PROJECT, SortDirection.Desc)
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
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		gap: var(--l);
		@media screen and (max-width: 62rem) {
			grid-template-columns: 1fr;
			column-gap: 0;
			row-gap: var(--l);
		}
		.entry {
			position: relative;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			transition: var(--transition);
			height: 100%;
			color: var(--c-font);
			text-decoration: none;
			@media screen and (max-width: 62rem) {
				grid-column: span 1;
			}
			&[data-highlighted='false'] {
				grid-column: span 3;
				display: flex;
				flex-direction: row;
				gap: 0;
				@media screen and (max-width: 32rem) {
					flex-direction: column;
				}
				> picture {
					width: 12rem;
					height: 12rem;
					@media screen and (max-width: 32rem) {
						width: 100%;
						height: auto;
					}
					img {
						width: inherit;
						height: inherit;
						border-radius: var(--border-radius) 0 0 var(--border-radius);
						aspect-ratio: 1 / 1;
						filter: grayscale(1);
						opacity: 0.5;
						@media screen and (max-width: 32rem) {
							border-radius: var(--border-radius) var(--border-radius) 0 0;
						}
					}
				}
				> .content {
					padding: var(--l);
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-content: stretch;
					align-items: stretch;
				}
			}
			&[data-highlighted='true'] {
				grid-column: span 2;
				> picture {
					width: 100%;
					img {
						width: 100%;
						height: inherit;
						border-radius: var(--border-radius) var(--border-radius) 0 0;
						aspect-ratio: 1 / 1;
						filter: grayscale(1);
						opacity: 0.5;
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
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-content: flex-start;
				align-items: stretch;
				padding: var(--l);
				text-align: left;
				strong {
					margin: 0 0 var(--xs) 0;
					font-weight: 900;
					font-size: var(--font-m);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
				p {
					margin: 0 0 var(--s) 0;
					line-height: 1.5;
					font-size: var(--font-m);
				}
				.tags {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-content: flex-start;
					align-items: flex-start;
					gap: var(--xs);
				}
			}
			:global(.arrow) {
				color: var(--c-font-accent-dark);
				size: var(--l);
				position: absolute;
				top: var(--m);
				right: calc((-1) * var(--m));
				opacity: 0;
				transition: var(--transition);
				border: 4px solid var(--c-light);
				border-radius: 100%;
				background: var(--c-light);
				box-shadow:
					0 1px 2px rgba(0, 0, 0, 0.03),
					0 2px 4px rgba(0, 0, 0, 0.03),
					0 4px 8px rgba(0, 0, 0, 0.03),
					0 8px 16px rgba(0, 0, 0, 0.03),
					0 16px 32px rgba(0, 0, 0, 0.03),
					0 32px 64px rgba(0, 0, 0, 0.03);
			}
		}
	}
</style>
