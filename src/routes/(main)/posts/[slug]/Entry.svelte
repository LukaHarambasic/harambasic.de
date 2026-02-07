<script lang="ts">
	import { page } from '$app/stores';
	import BaseCallout from '$lib/components/Base/BaseCallout.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import EntryHeader from '$lib/components/EntryHeader/EntryHeader.svelte';
	import PostsTableOfContent from './TableOfContent.svelte';
	import type { Post } from '$lib/types/post';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let tldr = $derived(post.tldr);
	let tags = $derived(post.tags);
	let html = $derived(post.html);
	let toc = $derived(post.toc);
	let publishedIso = $derived(post.published.raw?.toISOString());
	let publishedDisplay = $derived(post.published.display);
	let authorUrl = $derived($page.data.permalink ?? 'https://harambasic.de');
</script>

{#snippet authorDateMeta()}
	<span class="p-author h-card">
		<a href={authorUrl} rel="author">Luka Harambasic</a>
	</span>
	{#if publishedIso}
		<span class="meta-sep" aria-hidden="true"> · </span>
		<time class="dt-published" datetime={publishedIso}>{publishedDisplay}</time>
	{/if}
{/snippet}

<article class="h-entry">
	<EntryHeader title={post.title} meta={authorDateMeta} />

	{#if tldr}
		<div class="tldr">
			<BaseCallout prefix="TL;DR">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html tldr}
			</BaseCallout>
		</div>
	{/if}

	{#if toc.length > 0}
		<details class="toc-details">
			<summary>Table of contents</summary>
			<PostsTableOfContent nodes={toc} />
		</details>
	{/if}

	<section class="post">
		<BaseRichText class="content e-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</BaseRichText>
	</section>

	{#if tags.length > 0}
		<div class="tags">
			<ul>
				{#each tags as tag}
					<li>
						<BaseTag {tag} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="entry-footer">
		<BaseRichText element="footer">
			<BaseRichText class="rss">
				<a href="/posts/rss">RSS Feed</a>
			</BaseRichText>
		</BaseRichText>
	</div>
</article>

<style lang="postcss">
	article {
		display: flex;
		margin: 0;
		width: 100%;
		flex-direction: column;
		gap: var(--l);
		.tldr {
			order: 0;
		}
		.toc-details {
			margin: 0;
			summary {
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 600;
				cursor: pointer;
			}
		}
		.post {
			order: 1;
		}
		.tags {
			ul {
				display: flex;
				position: relative;
				margin: 0;
				padding: 0;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--xs);
				list-style: none;
			}
		}
		.entry-footer {
			margin: var(--l) 0 0 0;
			text-align: center;
		}
	}
</style>
