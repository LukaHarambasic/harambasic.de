<script lang="ts">
	import type { Project } from '$lib/types/project';
	import type { WorkEntry } from '$lib/types/workEntry';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	const pictures = import.meta.glob(
		'../../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../../../assets/img/projects/${name}`];
		if (!image) {
			return {};
		}
		return (image as any).default || {};
	};

	interface Props {
		entry: Project;
		relatedWork?: WorkEntry[];
	}

	let { entry, relatedWork = [] }: Props = $props();
</script>

<article class="h-entry">
	<enhanced:img
		src={getImage(entry.image)}
		sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
		alt={entry.title}
	/>
	<div class="content">
		<div class="rich-text">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html entry.html}
		</div>
		<ul class="tags">
			{#each entry.tags as tag}
				<li>
					<BaseTag {tag} />
				</li>
			{/each}
		</ul>
		<ul class="links rich-text">
			{#each entry.links as link}
				<li>
					<a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
				</li>
			{/each}
		</ul>
		{#if relatedWork.length > 0}
			<div class="related-work">
				<h3>Related Work</h3>
				<ul>
					{#each relatedWork as work}
						<li>
							<a href={work.relativePath}>{work.title}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</article>

<style lang="postcss">
	article {
		display: flex;
		width: 90ch;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--l);
		@media screen and (width <= 64rem) {
			width: 100%;
		}
		@media screen and (width <= 48rem) {
			flex-direction: column;
		}
		> picture {
			size: 20rem;
			@media screen and (width <= 64rem) {
				size: 15rem;
			}
			@media screen and (width <= 48rem) {
				width: 100%;
				height: auto;
			}
			img {
				width: inherit;
				height: inherit;
				border-radius: var(--border-radius);
				aspect-ratio: 1 / 1;
			}
		}
		> .content {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			.tags {
				display: flex;
				margin: 0 0 var(--m) 0;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--xs);
			}
			.rich-text {
				margin: 0 0 var(--m) 0;
			}
			.links {
				display: flex;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				align-content: stretch;
				gap: var(--m);
				flex-base: 100%;
			}
			.related-work {
				margin-top: var(--m);
				width: 100%;
				h3 {
					margin: 0 0 var(--s) 0;
					font-family: var(--font-family);
					font-size: var(--font-m);
					font-weight: 700;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				ul {
					margin: 0;
					padding: 0;
					list-style: none;
					li {
						margin-bottom: var(--xs);
						a {
							color: var(--c-font);
							text-decoration: none;
							&:hover {
								text-decoration: underline;
							}
						}
					}
				}
			}
		}
	}
</style>
