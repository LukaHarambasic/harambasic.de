<script lang="ts">
	import BaseCallout from '$lib/components/Base/BaseCallout.svelte';
	import PostsTableOfContent from './TableOfContent.svelte';
	import type { Post } from '$lib/types/post';
	import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	export let post: Post;
	const { tldr, tags, html, toc } = post;
	//console.log(toc)
</script>

<article class="h-entry">
	<!-- TODO the 4 section could be split up in dedicated files -->
	<div class="placeholder card"></div>
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
	<div class="toc">
		<div class="content card">
			<PostsTableOfContent nodes={toc} />
		</div>
	</div>
	<div class="tldr">
		<BaseCallout prefix="TL;DR">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html tldr}
		</BaseCallout>
	</div>
	<section class="post">
		<div class="content rich-text e-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</div>
	</section>
	<footer class="rich-text">
		<!-- TODO -->
		<!-- <div class="follow">
      If you have any thoughts or questions feel free to share them in
      <a href="https://TODO.com">this thread</a> or send me an
      <a href="https://TODO.com">email</a>. And if you want to stay up to date you can subscribe to the
      <a href="https://TODO.com">RSS feed</a>.
    </div> -->
		<div class="author">
			<a href="https://harambasic.de" rel="author" class="p-author h-card">by Luka Harambasic</a>
		</div>
	</footer>
</article>

<style lang="postcss">
	article {
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		grid-template-columns: calc(70% - var(--l)) 30%;
		grid-template-areas: 'tldr placeholder' 'post tags' 'post toc' 'footer footer';
		column-gap: var(--l);
		row-gap: var(--l);
		width: 100%;
		@media screen and (max-width: 74rem) {
			grid-template-areas: 'tldr' 'tags' 'toc' 'post' 'footer';
			grid-template-rows: auto;
			grid-template-columns: 100%;
		}
		.placeholder {
			grid-area: placeholder;
			opacity: 0.5;
			@media screen and (max-width: 74rem) {
				display: none;
			}
		}
		.tags {
			grid-area: tags;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			ul {
				display: flex;
				position: relative;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--xs);
			}
		}
		.toc {
			grid-area: toc;
			.content {
				position: sticky;
				top: var(--l);
			}
		}
		.tldr {
			grid-area: tldr;
		}
		.post {
			grid-area: post;
		}
		footer {
			grid-area: footer;
			border-radius: var(--border-radius);
			background: var(--c-surface);
			padding: var(--l);
			.author {
				text-align: center;
				a {
					font-weight: 900;
					font-size: var(--font-s);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
					text-decoration: none;
					&:hover {
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
					}
				}
			}
		}
	}
</style>
