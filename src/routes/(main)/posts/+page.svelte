<script lang="ts">
	import type { PageData } from '../$types';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte';
	import EntriesTags from '$lib/components/Entries/EntriesTags.svelte';
	import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { SortDirection, BASE_SORT_PROPERTIES, SORT_DEFAULTS } from '$lib/types/enums';
	import type { PostSortProperty } from '$lib/types/enums';
	import { isValidPostSortProperty, isValidSortDirection } from '$lib/util/helper';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entries = $derived(data.posts[0]);
	let tags = $derived(data.posts[1]);

	let filterTagSlug = $state('all');

	let sortProperty: PostSortProperty = $state(SORT_DEFAULTS.POST);
	let sortDirection: SortDirection = $state(SortDirection.Desc);
	let filteredAndSortedEntries = $derived(
		filterAndSort(entries, filterTagSlug, sortProperty, sortDirection)
	);

	function onProperty(event: { detail: PostSortProperty }) {
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

		const propertyParam = $page.url.searchParams.get('property');
		sortProperty =
			propertyParam && isValidPostSortProperty(propertyParam) ? propertyParam : SORT_DEFAULTS.POST;

		const directionParam = $page.url.searchParams.get('direction');
		sortDirection =
			directionParam && isValidSortDirection(directionParam) ? directionParam : SortDirection.Desc;
	});
</script>

<Entries path="/posts">
	{#snippet sidebar()}
		<EntriesSidebar>
			<EntriesSorter
				propertiesArray={BASE_SORT_PROPERTIES}
				propertiesDefault={SORT_DEFAULTS.POST}
				on:propertyChange={onProperty}
				on:directionChange={onDirection}
			/>
			<EntriesTags {tags} on:tagChange={onTag} />
		</EntriesSidebar>
	{/snippet}
	{#snippet entries()}
		<ul class="entries">
			{#each filteredAndSortedEntries as post}
				<li class="h-feed">
					<BaseCard element="a" href={post.relativePath} variant="default" class="row">
						<div class="external-link">
							<Icon icon="ph:arrow-up-right-bold" />
						</div>
						<div class="column">
							<strong class="title">
								{post.title}
							</strong>
							<ul class="tags">
								{#each post.tags as tag}
									<li>
										<BaseTag {tag} />
									</li>
								{/each}
							</ul>
						</div>
						<time class="date dt-published" datetime={post?.published?.raw?.toString()}>
							{post.published.display}
						</time>
					</BaseCard>
				</li>
			{/each}
		</ul>
	{/snippet}
</Entries>

<style lang="postcss">
	.entries {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--l);
	}
</style>
