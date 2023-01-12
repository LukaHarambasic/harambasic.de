<script lang="ts">
	import { onMount } from 'svelte';
	import { entries, filterTagSlug, tags } from '$lib/data/posts/store';

	onMount(() => {
		const slug = new URLSearchParams(window.location.search).get('tag') || 'all';
		filterTagSlug.set(slug);
	});

	function onSelectTag(slug: string) {
		filterTagSlug.set(slug);
		const url = new URL(window.location.toString());
		url.searchParams.set('tag', slug);
		window.history.pushState({}, '', url.href);
	}
</script>

<section>
	<!-- TODO empty state, but tbh this shouldnt happen -->
	<aside class="tags">
		<h2>Tags</h2>
		<ol>
			{#each $tags as tag}
				<li>
					<button
						class:selected={$filterTagSlug === tag.slug}
						on:click={() => onSelectTag(tag.slug)}
					>
						{tag.display} ({tag.count})
					</button>
				</li>
			{/each}
		</ol>
	</aside>
	<div class="posts">
		<ul>
			{#each $entries as post}
				<li class="h-feed">
					<a href={post.relativePath}>
						<div class="column">
							<strong class="title">
								{post.title}
							</strong>
							<ul class="tags">
								{#each post.tags as category}
									<li>
										<a href={category.fullPath} class="link">
											{category.display}
										</a>
									</li>
								{/each}
							</ul>
						</div>
						<time class="date dt-published" datetime={post.published.raw.toString()}>
							{post.published.display}
						</time>
						<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 32 32"
							><rect width="32" height="32" fill="none" /><circle
								cx="128"
								cy="128"
								r="96"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="24"
							/><polyline
								points="134.1 161.9 168 128 134.1 94.1"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="24"
							/><line
								x1="88"
								y1="128"
								x2="168"
								y2="128"
								fill="none"
								stroke="#000000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="24"
							/></svg
						>
					</a>
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
		> .tags {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			gap: var(--m);
			width: var(--layout-sidebar);
			ol {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: stretch;
				gap: var(--s);
				li {
					button {
						margin: 0;
						border: none;
						background: none;
						padding: 0;
						color: var(--c-font-accent-dark);
						font-size: var(--font-s);
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
	}
	.posts {
		width: 100%;
		> ul {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			gap: var(--l);
			> li {
				> a {
					display: flex;
					position: relative;
					flex-direction: row;
					flex-wrap: nowrap;
					align-content: stretch;
					justify-content: space-between;
					align-items: flex-start;
					gap: var(--l);
					transition: var(--transition);
					border-radius: var(--border-radius);
					background: var(--c-surface);
					padding: var(--l);
					color: var(--c-font);
					text-decoration: none;
					&:hover {
						transform: scale(1.05);
						cursor: pointer;
						svg {
							opacity: 1;
						}
					}
					.column {
						display: flex;
						flex-direction: column;
						flex-wrap: nowrap;
						align-content: stretch;
						justify-content: flex-start;
						align-items: stretch;
						gap: var(--xs);
					}
					.title {
						display: inline-block;
						font-weight: 900;
						font-size: var(--font-m);
						line-height: 1.2;
						font-family: var(--font-family);
						letter-spacing: var(--font-letter-spacing-headline);
					}
					.tags {
						flex-base: 100%;
						display: flex;
						flex-grow: 1;
						flex-direction: row;
						flex-wrap: nowrap;
						align-content: stretch;
						justify-content: flex-start;
						align-items: flex-start;
						gap: var(--xs);
						li {
							a {
								color: var(--c-font-accent-dark);
								font-weight: 400;
								font-size: var(--font-s);
								text-decoration: none;
								&:hover {
									text-decoration: underline;
									text-decoration-thickness: var(--underline-thickness);
								}
							}
						}
					}
					.date {
						display: inline-block;
						margin: 0 0 var(--xs) 0;
						font-size: var(--font-m);
					}
					svg {
						size: var(--l);
						position: absolute;
						top: var(--m);
						right: calc((-1) * var(--m));
						opacity: 0;
						transition: var(--transition);
						border: 4px solid var(--c-light);
						border-radius: 100%;
						background: var(--c-light);
					}
				}
			}
		}
	}
</style>
