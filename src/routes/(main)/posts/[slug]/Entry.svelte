<script lang="ts">
	import BaseCallout from '$lib/components/Base/BaseCallout.svelte';
	import PostsTableOfContent from './TableOfContent.svelte';
	import type { Post } from '$lib/types/post';
	import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	const { tldr, tags, html, toc } = post;
</script>

<article class="h-entry">
	<section class="post">
		<div class="content rich-text e-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</div>
	</section>
	<aside class="sidebar">
		<div class="author card">
			<BaseHeadlineIcon title="Author" icon="ph:pencil-bold" />
			<a href="https://harambasic.de" rel="author" class="p-author h-card">Luka Harambasic</a>
		</div>
		<div class="tags card">
			<BaseHeadlineIcon title="Tags" icon="ph:hash-bold" />
			<ul>
				{#each tags as tag}
					<li>
						<BaseTag {tag} />
					</li>
				{/each}
			</ul>
		</div>
		<div class="toc card">
			<PostsTableOfContent nodes={toc} />
		</div>
	</aside>
	<div class="tldr">
		<BaseCallout prefix="TL;DR">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html tldr}
		</BaseCallout>
	</div>
	<div class="placeholder card"></div>
	<footer class="rich-text">
		<div class="rss rich-text">
			<a href="/posts/rss">RSS Feed</a>
		</div>
	</footer>
</article>

<style lang="postcss">
	article {
		display: grid;
		width: 100%;
		gap: var(--l);
		grid:
			'tldr placeholder' auto
			'post sidebar' 1fr
			'footer footer' auto
			/ calc(70% - var(--l)) 30%;
		@media screen and (width <= 74rem) {
			grid:
				'tldr' auto
				'sidebar' auto
				'post' auto
				'footer' auto
				/ 100%;
		}
		.tldr {
			grid-area: tldr;
		}
		.placeholder {
			opacity: 0.5;
			grid-area: placeholder;
			@media screen and (width <= 74rem) {
				display: none;
			}
		}
		.sidebar {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			gap: var(--l);
			grid-area: sidebar;
			.author {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				a {
					color: var(--c-font);
					font-family: var(--font-family);
					font-size: var(--font-m);
					letter-spacing: var(--font-letter-spacing-headline);
					text-decoration: none;
					&:hover {
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
					}
				}
			}
			.tags {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: stretch;
				align-content: stretch;
				ul {
					display: flex;
					position: relative;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: flex-start;
					align-content: stretch;
					gap: var(--xs);
				}
			}
			.toc {
				position: sticky;
				top: var(--l);
			}
		}
		.post {
			grid-area: post;
		}
		footer {
			margin: var(--l) 0 0 0;
			grid-area: footer;
			text-align: center;
		}
	}
</style>
