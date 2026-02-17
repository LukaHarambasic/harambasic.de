<script lang="ts">
	import { resolvePath } from '$lib/util/paths';
	import type { PageData } from '../$types';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Icon from '@iconify/svelte';
	import { SortDirection, SORT_DEFAULTS } from '$lib/types/enums';
	import { filterAndSort } from '$lib/util/entryHelpers';
	import { formatDateDisplay } from '$lib/util/helper';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entries = $derived(data.posts[0] ?? []);
	let filteredAndSortedEntries = $derived(
		filterAndSort(entries, 'all', SORT_DEFAULTS.POST, SortDirection.Desc)
	);
</script>

<div class="posts-container">
	<Entries>
		{#snippet entries()}
			<ul class="entries">
				{#each filteredAndSortedEntries as post (post.slug)}
					<li class="post-row h-feed">
						<a
							href={resolvePath(post.relativePath)}
							class="row-link"
							aria-label="View post: {post.title}"
						>
							<span class="info">
								<h2 class="name">{post.title}</h2>
								<time class="dates dt-published" datetime={post.published.raw?.toISOString()}>
									{formatDateDisplay(post.published.display)}
								</time>
							</span>
							<span class="external-link">
								<Icon icon="ph:arrow-up-right-bold" />
							</span>
						</a>
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
		.entries {
			display: flex;
			margin: 0;
			padding: 0;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			gap: 0;
			list-style: none;
			.post-row {
				border-bottom: 1px solid var(--c-surface-accent);
				&:last-child {
					border-bottom: none;
				}
				.row-link {
					display: flex;
					padding: var(--l) 0;
					width: 100%;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-items: center;
					gap: var(--m);
					color: inherit;
					text-decoration: none;
					&:hover {
						.external-link {
							color: var(--c-font);
							transform: translateY(-2px) translateX(2px);
						}
					}
					.info {
						display: flex;
						min-width: 0;
						flex: 1;
						flex-direction: column;
						gap: var(--xs);
						.name {
							margin: 0;
							color: var(--c-font);
							font-family: var(--font-family);
							font-size: var(--font-m);
							font-weight: 900;
							line-height: 1.2;
							letter-spacing: var(--font-letter-spacing-headline);
						}
						.dates {
							color: var(--c-font-accent-dark);
							font-family: var(--font-family);
							font-size: var(--font-s);
							font-weight: 400;
							line-height: 1.5;
							white-space: nowrap;
						}
					}
					.external-link {
						display: flex;
						width: 1.5rem;
						height: 1.5rem;
						flex-shrink: 0;
						justify-content: center;
						align-items: center;
						color: var(--c-font-accent-super-light);
						transition: var(--transition);
						pointer-events: none;
						:global(svg) {
							width: 1rem;
							height: 1rem;
						}
					}
				}
			}
		}
	}
</style>
