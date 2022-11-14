<script lang="ts">
	import type { Category } from '../../types/category';
	import { SortDirection, SortProperty } from '../../types/enums';
	import type { Post } from '../../types/post';
	import { filterPostsByCategory, sortPosts } from '../../util/data/posts';
	import { getPath } from '../../util/helper';

	export let categories: Category[];
	let selectedCategory: string;

	export let posts: Post[];
	let sortedPosts: Post[] = sortPosts(posts, SortProperty.Date, SortDirection.Desc);
	$: filteredPosts = filterPostsByCategory(sortedPosts, selectedCategory);
</script>

<section class="filter">
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
</section>
<section class="posts">
	<ul>
		{#each filteredPosts as post}
			<li class="h-feed">
				<a href={getPath('posts', post)}>
					<strong>
						{post.title}
					</strong>
					<time class="date dt-published" datetime={post.publishDate.toString()}>
						{post.publishDateFormatted}
					</time>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="192"
						height="192"
						fill="#000000"
						viewBox="0 0 256 256"
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
</section>

<style lang="postcss">
	.filter {
		width: 36rem;
	}
	.posts {
		width: 36rem;
		ul {
			width: 100%;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-content: stretch;
			align-items: stretch;
			li {
				width: 100%;
				a {
					position: relative;
					width: 100%;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					justify-content: space-between;
					align-content: stretch;
					align-items: flex-start;
					gap: var(--xl);
					color: var(--c-font);
					text-decoration: none;
					padding: var(--l);
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
					/* overflow: hidden; */
					&:hover {
						cursor: pointer;
						svg {
							right: var(--m);
						}
					}
					strong {
						display: block;
						margin: 0 0 var(--xs) 0;
						font-weight: 900;
						font-size: 1rem;
						font-family: 'Source Sans Pro', sans-serif;
						letter-spacing: 0.2px;
						line-height: 1.2;
					}
					time {
						display: inline-block;
						font-size: 1rem;
						margin: 0 0 var(--xs) 0;
					}
					svg {
						position: absolute;
						right: -2rem;
						top: var(--l);
						size: 1.5rem;
						transition: var(--transition);
					}
				}
			}
		}
	}
</style>
