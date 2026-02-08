<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import BaseCallout from '$lib/components/Base/BaseCallout.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import EntryHeader from '$lib/components/EntryHeader/EntryHeader.svelte';
	import PostsTableOfContent from './TableOfContent.svelte';
	import type { Post } from '$lib/types/post';

	interface Props {
		post: Post;
	}

	let { post }: Props = $props();
	let tocOpen = $state(false);
	let tldr = $derived(post.tldr);
	let html = $derived(post.html);
	let toc = $derived(post.toc);
	let publishedIso = $derived(post.published.raw?.toISOString());
	let publishedDisplay = $derived(post.published.display);
	let authorUrl = $derived($page.data.permalink ?? 'https://harambasic.de');
</script>

{#snippet authorDateMeta()}
	<span class="p-author h-card">
		<a class="author-link" href={authorUrl} rel="author">Luka Harambasic</a>
	</span>
	{#if publishedIso}
		<span class="meta-sep" aria-hidden="true"> · </span>
		<time class="dt-published" datetime={publishedIso}>{publishedDisplay}</time>
	{/if}
{/snippet}

<article class="h-entry">
	<EntryHeader title={post.title} meta={authorDateMeta} />
	<div class="sep" aria-hidden="true"></div>

	{#if tldr}
		<div class="tldr">
			<BaseCallout prefix="TL;DR" noCard>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html tldr}
			</BaseCallout>
		</div>
		<div class="sep" aria-hidden="true"></div>
	{/if}

	{#if toc.length > 0}
		<div class="toc-wrapper">
			<details class="toc-details" bind:open={tocOpen}>
				<summary class="toc-summary">
					<span class="toc-icon" class:open={tocOpen}>
						<Icon icon="ph:caret-down-bold" />
					</span>
					<span>Table of contents</span>
				</summary>
				<div class="toc-body">
					<PostsTableOfContent nodes={toc} />
				</div>
			</details>
		</div>
		<div class="sep" aria-hidden="true"></div>
	{/if}

	<section class="post">
		<BaseRichText class="content e-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html html}
		</BaseRichText>
	</section>
</article>

<style lang="postcss">
	article {
		display: flex;
		margin: 0;
		width: 100%;
		flex-direction: column;
		gap: var(--l);
		:global(.entry-header .meta .author-link) {
			color: var(--c-font);
			font-style: normal;
			text-decoration: none;
		}
		.sep {
			margin: 0;
			width: 100%;
			height: 0;
			border: none;
			border-bottom: 1px solid var(--c-surface-accent);
		}
		.tldr {
			order: 0;
		}
		.toc-wrapper {
			display: block;
		}
		.toc-details {
			margin: 0;
			padding: 0;
			.toc-summary {
				display: flex;
				margin: 0;
				padding: 0;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				gap: var(--s);
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 600;
				list-style: none;
				cursor: pointer;
				&::-webkit-details-marker {
					display: none;
				}
				&::marker {
					content: none;
				}
			}
			&[open] .toc-summary {
				margin-bottom: var(--m);
			}
			.toc-icon {
				display: inline-flex;
				width: 1.25rem;
				height: 1.25rem;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
				transition: transform var(--transition);
				&.open {
					transform: rotate(180deg);
				}
			}
			.toc-icon :global(svg) {
				width: 1.25rem;
				height: 1.25rem;
			}
			.toc-body {
				padding: 0;
			}
		}
		.post {
			order: 1;
		}
	}
</style>
