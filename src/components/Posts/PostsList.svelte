<script lang="ts">
	import { onMount } from 'svelte';
	import type { Category } from '../../types/category';
	import { SortDirection, SortProperty } from '../../types/enums';
	import type { Post } from '../../types/post';
	import { filterPostsByCategory, sortPosts } from '../../util/data/posts';
	import { getPath } from '../../util/helper';

	export let categories: Category[];
	let selectedCategory: string = 'all';

	export let posts: Post[];
	let sortedPosts: Post[] = sortPosts(posts, SortProperty.Date, SortDirection.Asc);
	$: filteredPosts = filterPostsByCategory(sortedPosts, selectedCategory);

	onMount(() => {
		selectedCategory = new URLSearchParams(window.location.search).get('category') || 'all';
	});

	function onSelectCategory(categorySlug: string) {
		selectedCategory = categorySlug;
		const url = new URL(window.location.toString());
		url.searchParams.set('category', selectedCategory);
		window.history.pushState({}, '', url.href);
	}
</script>

<section>
	<aside class="categories">
		<h2>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="#000000"
				viewBox="0 0 256 256"
				><rect width="32" height="32" fill="none" /><path
					d="M42.1,48H213.9a8,8,0,0,1,5.9,13.4l-65.7,72.3a7.8,7.8,0,0,0-2.1,5.4v56.6a7.9,7.9,0,0,1-3.6,6.7l-32,21.3a8,8,0,0,1-12.4-6.6v-78a7.8,7.8,0,0,0-2.1-5.4L36.2,61.4A8,8,0,0,1,42.1,48Z"
					fill="none"
					stroke="#000000"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="24"
				/></svg
			> Categories
		</h2>
		<ol>
			<li>
				<button
					class:selected={selectedCategory === 'all'}
					on:click={() => onSelectCategory('all')}
				>
					All ({posts.length})</button
				>
			</li>
			{#each categories as category}
				<li>
					<button
						class:selected={selectedCategory === category.slug}
						on:click={() => onSelectCategory(category.slug)}
					>
						{category.display} ({category.postCount})
					</button>
				</li>
			{/each}
		</ol>
	</aside>
	<div class="posts">
		<ul>
			{#each filteredPosts as post}
				<li class="h-feed">
					<a href={getPath('posts', post)}>
						<div class="column">
							<strong class="title">
								{post.title}
							</strong>
							<ul class="categories">
								{#each post.categories as category}
									<li>
										<a href={category.fullPath} class="link">
											{category.display}
										</a>
									</li>
								{/each}
							</ul>
						</div>
						<time class="date dt-published" datetime={post.publishDate.toString()}>
							{post.publishDateFormatted}
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
	h1 {
		width: 100%;
		text-align: center;
	}
	section {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--xl);
		/* TODO align  */
		width: var(--layout-l);
		font-weight: 600;
		font-size: var(--font-m);
		font-family: var(--font-family);
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.categories {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--m);
		/* TODO align */
		width: 12rem;
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
					color: var(--c-font-80);
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
			width: 100%;
			> li {
				width: 100%;
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
					.categories {
						display: flex;
						position: relative;
						flex-direction: row;
						flex-wrap: nowrap;
						align-content: stretch;
						justify-content: flex-start;
						align-items: flex-start;
						gap: var(--xs);
						li {
							a {
								color: var(--c-font-60);
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
