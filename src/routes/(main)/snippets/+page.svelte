<script lang="ts">
	import type { PageData } from '../$types';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte';
	import EntriesTags from '$lib/components/Entries/EntriesTags.svelte';
	import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { SortDirection, BASE_SORT_PROPERTIES, SORT_DEFAULTS } from '$lib/types/enums';
	import type { SnippetSortProperty } from '$lib/types/enums';
	import { isValidSnippetSortProperty, isValidSortDirection } from '$lib/util/helper';
	import { filterAndSort } from '$lib/data/snippets/helper';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const [entries, tags] = data.snippets;

	let filterTagSlug = $state('all');

	let sortProperty: SnippetSortProperty = $state(SORT_DEFAULTS.SNIPPET);
	let sortDirection: SortDirection = $state(SortDirection.Desc);
	let filteredAndSortedEntries = $derived(
		filterAndSort(entries, filterTagSlug, sortProperty, sortDirection)
	);

	function onProperty(event: { detail: SnippetSortProperty }) {
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
			propertyParam && isValidSnippetSortProperty(propertyParam)
				? propertyParam
				: SORT_DEFAULTS.SNIPPET;

		const directionParam = $page.url.searchParams.get('direction');
		sortDirection =
			directionParam && isValidSortDirection(directionParam) ? directionParam : SortDirection.Desc;
	});
</script>

<Entries path="/snippets">
	{#snippet sidebar()}
		<EntriesSidebar>
			<EntriesSorter
				propertiesArray={BASE_SORT_PROPERTIES}
				propertiesDefault={SORT_DEFAULTS.SNIPPET}
				on:propertyChange={onProperty}
				on:directionChange={onDirection}
			/>
			<EntriesTags {tags} on:tagChange={onTag} />
		</EntriesSidebar>
	{/snippet}
	{#snippet entries()}
		<ul class="entries">
			{#each filteredAndSortedEntries as snippet}
				<li class="h-feed">
					<a href={snippet.relativePath}>
						<div class="column">
							<strong class="title">
								{snippet.title}
							</strong>
							<ul class="tags">
								{#each snippet.tags as tag}
									<li>
										<BaseTag {tag} />
									</li>
								{/each}
							</ul>
						</div>
						<time class="date dt-published" datetime={snippet?.published?.raw?.toString()}>
							{snippet.published.display}
						</time>
						<Icon class="arrow" icon="ph:arrow-circle-right-bold" />
					</a>
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
		> li {
			> a {
				display: flex;
				position: relative;
				padding: var(--l);
				border: var(--border);
				border-radius: var(--border-radius);
				background: var(--c-surface);
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: flex-start;
				align-content: stretch;
				gap: var(--l);
				color: var(--c-font);
				text-decoration: none;
				transition: var(--transition);
				@media screen and (width <= 50rem) {
					flex-direction: column-reverse;
				}
				&:hover {
					transform: scale(0.97);
					cursor: pointer;
					:global(svg) {
						opacity: 1;
					}
				}
				.column {
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-items: stretch;
					align-content: stretch;
					gap: var(--xs);
				}
				.title {
					display: inline-block;
					font-family: var(--font-family);
					font-size: var(--font-m);
					font-weight: 900;
					line-height: 1.2;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				.tags {
					display: flex;
					flex-grow: 1;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: flex-start;
					align-content: stretch;
					gap: var(--xs);
					flex-base: 100%;
				}
				.date {
					display: inline-block;
					margin: 0 0 var(--xs) 0;
					flex-shrink: 0;
					color: var(--c-font);
					font-size: var(--font-m);
					font-weight: 400;
					font-style: italic;
					text-align: right;
					text-decoration: none;
					@media screen and (width <= 50rem) {
						margin: 0 0 calc(-1 * var(--m));
						flex-shrink: 1;
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
	}
</style>
