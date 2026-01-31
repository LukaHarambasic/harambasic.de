<script lang="ts">
	import type { PageData } from '../$types';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Icon from '@iconify/svelte';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import { formatDateDisplay } from '$lib/util/helper';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entries = $derived(data.posts[0]);
	let filteredAndSortedEntries = $derived(
		filterAndSort(entries, 'all', SORT_DEFAULTS.POST, SortDirection.Desc)
	);
</script>

<div class="posts-container">
	<Entries path="/posts">
		{#snippet entries()}
			<ul class="entries">
				{#each filteredAndSortedEntries as post}
					<li class="h-feed">
						<BaseCard
							element="a"
							href={post.relativePath}
							variant="default"
							class="withIcon post-card"
							aria-label="View post: {post.title}"
						>
							<div class="card-header">
								<div class="header-content">
									<div class="company-header">
										<div class="company-info">
											<h2 class="company-name">{post.title}</h2>
										</div>
									</div>
								</div>
								<div class="external-link">
									<Icon icon="ph:arrow-up-right-bold" />
								</div>
							</div>
							<div class="card-metadata">
								<div class="card-positions">
									<div class="position-row">
										<time
											class="position-dates dt-published"
											datetime={post.published.raw?.toISOString()}
										>
											{formatDateDisplay(post.published.display)}
										</time>
									</div>
								</div>
							</div>
						</BaseCard>
					</li>
				{/each}
			</ul>
		{/snippet}
	</Entries>
</div>

<style lang="postcss">
	.posts-container {
		margin-right: auto;
		margin-left: auto;
		width: 100%;
		max-width: calc(var(--layout-xl) * 0.618);
	}
	.entries {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--l);
	}
	:global(.post-card) {
		padding-bottom: var(--m);
		border-color: color-mix(in srgb, var(--c-surface-accent) 40%, var(--c-font));
		background: color-mix(in srgb, var(--c-light) 50%, var(--c-surface));
	}
	:global(.base-card.post-card .company-name) {
		font-size: var(--font-m);
	}
	:global(.post-card .position-row) {
		display: block;
		text-align: left;
	}
</style>
