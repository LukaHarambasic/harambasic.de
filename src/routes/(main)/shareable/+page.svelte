<script lang="ts">
	import { page } from '$app/stores';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte';
	import EntriesTags from '$lib/components/Entries/EntriesTags.svelte';
	import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte';
	import { filterAndSort } from '$lib/data/shareable/helper';
	import { ShareableSortProperty, SortDirection } from '$lib/types/enums';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let data: PageData;
	const [entries, tags] = data.shareables;

	// all that "as" stuff should be removed, thats not right
	$: filterTagSlug = 'all';
	$: sortProperty = ShareableSortProperty.Published;
	$: sortDirection = SortDirection.Desc;
	$: filteredAndSorted = filterAndSort(entries, filterTagSlug, sortProperty, sortDirection);

	function onProperty(event: { detail: ShareableSortProperty }) {
		sortProperty = event.detail;
	}

	function onDirection(event: { detail: SortDirection }) {
		sortDirection = event.detail;
	}

	function onTag(event: { detail: string }) {
		filterTagSlug = event.detail;
	}

	onMount(() => {
		filterTagSlug = $page.url.searchParams.get('tag') || 'all';
		sortProperty =
			($page.url.searchParams.get('property') as ShareableSortProperty) ||
			ShareableSortProperty.Published;
		sortDirection =
			($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc;
	});
</script>

<p>TODO: Newsletter block to sign up to get infrequent updates.</p>
<Entries>
	<EntriesSidebar slot="sidebar">
		<EntriesSorter
			propertiesEnum={ShareableSortProperty}
			on:propertyChange={onProperty}
			on:directionChange={onDirection}
		/>
		<EntriesTags {tags} on:tagChange={onTag} />
	</EntriesSidebar>
	<ul slot="entries" class="entries">
		{#each filteredAndSorted as entry}
			<li class="h-feed">
				<a href={entry.url}>
					<div class="content">
						<!-- TODO add fields from supabase -->
						<strong class="title">
							{entry.title}
						</strong>
						<p>{entry.description}</p>
					</div>
					<Icon class="arrow" icon="ph:arrow-square-out-bold" />
				</a>
			</li>
		{/each}
	</ul>
</Entries>

<style lang="postcss">
	.entries {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		width: 100%;
		> li {
			width: 100%;
			> a {
				display: flex;
				position: relative;
				flex-direction: row;
				flex-wrap: nowrap;
				align-content: flex-start;
				justify-content: flex-start;
				align-items: stretch;
				transition: var(--transition);
				border-radius: var(--border-radius);
				background: var(--c-surface);
				color: var(--c-font);
				text-decoration: none;
				&:hover {
					transform: scale(0.97);
					cursor: pointer;
					:global(svg) {
						opacity: 1;
					}
				}
				.content {
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					align-content: stretch;
					justify-content: flex-start;
					align-items: stretch;
					gap: var(--xs);
					padding: var(--l);
					.title {
						display: inline-block;
						font-weight: 900;
						font-size: var(--font-m);
						line-height: 1.2;
						font-family: var(--font-family);
						letter-spacing: var(--font-letter-spacing-headline);
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
	}
</style>
