<script lang="ts">
	import type { Category } from '../../types/category';
	import { SortDirection, SortProperty } from '../../types/enums';
	import type { Post } from '../../types/post';
	import { filterPostsByCategory, sortPosts } from '../../util/data/posts';
	import { getPath } from '../../util/helper';
	import PostsCategories from '../../components/Posts/PostsCategories.astro';

	export let categories: Category[];
	let selectedCategory: string;

	export let posts: Post[];
	let sortedPosts: Post[] = sortPosts(posts, SortProperty.Date, SortDirection.Desc);
	$: filteredPosts = filterPostsByCategory(sortedPosts, selectedCategory);
</script>

<section>
	<div class="filter">
		<div class="select-button">
			<select bind:value={selectedCategory}>
				<option value="all">All</option>
				{#each categories as category}
					<option value={category.slug}>
						{category.display}
					</option>
				{/each}
			</select>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="#000000"
				viewBox="0 0 256 256"
				><rect width="256" height="256" fill="none" /><path
					d="M42.1,48H213.9a8,8,0,0,1,5.9,13.4l-65.7,72.3a7.8,7.8,0,0,0-2.1,5.4v56.6a7.9,7.9,0,0,1-3.6,6.7l-32,21.3a8,8,0,0,1-12.4-6.6v-78a7.8,7.8,0,0,0-2.1-5.4L36.2,61.4A8,8,0,0,1,42.1,48Z"
					fill="none"
					stroke="#000000"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="24"
				/></svg
			>
		</div>
	</div>
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
						<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256"
							><rect width="256" height="256" fill="none" /><circle
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
		flex-direction: column;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--xl);
		width: 36rem;
	}
	.posts {
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
						font-size: 1rem;
						line-height: 1.2;
						font-family: 'Source Sans Pro', sans-serif;
						letter-spacing: 0.2px;
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
								font-size: 0.9rem;
							}
						}
					}
					.date {
						display: inline-block;
						margin: 0 0 var(--xs) 0;
						font-size: 1rem;
					}
					svg {
						size: 2rem;
						position: absolute;
						top: var(--m);
						right: -1rem;
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
