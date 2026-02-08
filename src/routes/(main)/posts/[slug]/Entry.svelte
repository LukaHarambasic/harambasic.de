<script lang="ts">
	import BaseCallout from '$lib/components/Base/BaseCallout.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import PostsTableOfContent from './TableOfContent.svelte';
	import type { Post } from '$lib/types/post';
	import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let tldr = $derived(post.tldr);
	let tags = $derived(post.tags);
	let html = $derived(post.html);
	let toc = $derived(post.toc);
</script>

<article class="h-entry">
	<section class="post">
		<BaseRichText class="content e-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</BaseRichText>
	</section>
	<aside class="sidebar">
		<BaseCard class="author">
			<BaseHeadlineIcon title="Author" icon="ph:pencil-bold" />
			<a href="https://harambasic.de" rel="author" class="p-author h-card">Luka Harambasic</a>
		</BaseCard>
		<BaseCard class="tags">
			<BaseHeadlineIcon title="Tags" icon="ph:hash-bold" />
			<ul>
				{#each tags as tag}
					<li>
						<BaseTag {tag} />
					</li>
				{/each}
			</ul>
		</BaseCard>
		<BaseCard class="toc">
			<PostsTableOfContent nodes={toc} />
		</BaseCard>
	</aside>
	<div class="tldr">
		<BaseCallout prefix="TL;DR">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html tldr}
		</BaseCallout>
	</div>
	<BaseCard class="placeholder"></BaseCard>
</article>

<style lang="postcss">
	article {
		display: grid;
		width: 100%;
		gap: var(--l);
		grid:
			'tldr placeholder' auto
			'post sidebar' 1fr
			/ calc(70% - var(--l)) 30%;
		@media screen and (width <= 74rem) {
			grid:
				'tldr' auto
				'sidebar' auto
				'post' auto
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
			:global(.author) {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
			}
			:global(.author a) {
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-m);
				letter-spacing: var(--font-letter-spacing-headline);
				text-decoration: none;
			}
			:global(.author a:hover) {
				text-decoration: underline;
				text-decoration-thickness: var(--underline-thickness);
			}
			:global(.tags) {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: stretch;
				align-content: stretch;
			}
			:global(.tags ul) {
				display: flex;
				position: relative;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				align-content: stretch;
				gap: var(--xs);
			}
			:global(.toc) {
				position: sticky;
				top: var(--l);
			}
		}
		.post {
			grid-area: post;
		}
	}
</style>
