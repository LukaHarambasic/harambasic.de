<script lang="ts">
	import { storeProjects, entries, tags, filterTag } from '../../store/projectStore';
	import { getTagBySlug } from '../../util/entries';
	import { onMount } from 'svelte';

	export let raw: any;

	onMount(() => {
		storeProjects(raw);
		const slug = new URLSearchParams(window.location.search).get('tag') || 'all';
		filterTag.set(getTagBySlug(tags.get(), slug));
	});

	function onSelectTag(slug: string) {
		filterTag.set(getTagBySlug(tags.get(), slug));
		const url = new URL(window.location.toString());
		url.searchParams.set('tag', filterTag.get().slug);
		window.history.pushState({}, '', url.href);
	}
</script>

<section>
	<aside class="tags">
		<h2>Tags</h2>
		<ol>
			{#each $tags as tag}
				<li>
					<button
						class:selected={$filterTag.slug === tag.slug}
						on:click={() => onSelectTag(tag.slug)}
					>
						{tag.title} ({tag.count})
					</button>
				</li>
			{/each}
		</ol>
	</aside>
	<div class="entries">
		<ul>
			{#each $entries as entry}
				<li class="h-feed">
					<img src={entry.image} alt="TODO" width="8rem" />
					<div class="content">
						<strong>{entry.title}</strong>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="postcss">
	section {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--xl);
	}
	.tags {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--m);
		width: var(--layout-sidebar);
		svg {
			fill: white;
			size: 2rem;
		}
		ol {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: flex-start;
			justify-content: flex-start;
			align-items: flex-start;
			gap: var(--s);
			li {
				button {
					margin: 0;
					border: none;
					background: none;
					padding: 0;
					color: var(--c-font-accent-dark);
					font-size: var(--font-s);
					text-align: left;
					&:hover {
						cursor: pointer;
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
					}
					&.selected {
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
						&:hover {
							text-decoration: none;
						}
					}
				}
			}
		}
	}
	.entries {
		width: 100%;
		ul {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--xl);
			li {
				display: flex;
				position: relative;
				flex-direction: column;
				flex-wrap: nowrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: stretch;
				transition: var(--transition);
				border-radius: var(--border-radius);
				background: var(--c-surface);
				height: 100%;
				color: var(--c-font);
				text-decoration: none;
				&:hover {
					transform: scale(1.05);
					cursor: pointer;
					svg {
						opacity: 1;
					}
				}
				> img {
					border-radius: var(--border-radius) var(--border-radius) 0 0;
					aspect-ratio: 1 / 1;
					width: 100%;
				}
				> .content {
					padding: var(--l);
					strong {
						display: block;
						margin: 0 0 var(--xs) 0;
						font-weight: 900;
						font-size: var(--font-m);
						line-height: 1.2;
						font-family: var(--font-family);
						letter-spacing: var(--font-letter-spacing-headline);
					}
				}
			}
		}
	}
</style>
