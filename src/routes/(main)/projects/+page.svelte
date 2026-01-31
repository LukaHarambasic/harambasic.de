<script lang="ts">
	import type { PageData } from './$types';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
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

<Entries path={data.url}>
	{#snippet entries()}
		<div class="entries">
			{#each filteredAndSorted as entry, index}
				{@const imageData = getImage(entry.image)}
				<div class="entry-wrapper" data-highlighted={index < 3}>
					<BaseCard
						element="a"
						href={entry.relativePath}
						variant="featured"
						class="image noSpacing {index < 3 ? 'highlighted' : 'compact'}"
					>
						<Icon icon="ph:arrow-circle-right-bold" />
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
							<ul class="tags">
								{#each entry.tags as tag}
									<li>
										<BaseTag {tag} />
									</li>
								{/each}
							</ul>
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
			height: 100%;
			@media screen and (width <= 62rem) {
				grid-column: span 1;
			}
			&[data-highlighted='true'] {
				grid-column: span 2;
			}
			&[data-highlighted='false'] {
				grid-column: span 3;
			}
		}
	}
</style>
