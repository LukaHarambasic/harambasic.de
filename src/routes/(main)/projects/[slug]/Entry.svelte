<script lang="ts">
	import { resolvePath } from '$lib/util/paths';
	import type { Project } from '$lib/types/project';
	import type { WorkEntry } from '$lib/types/workEntry';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import EntryHeader from '$lib/components/EntryHeader/EntryHeader.svelte';
	import Icon from '@iconify/svelte';
	import { getImageFromGlob, type ImageGlobResult } from '$lib/util/images';

	const pictures: ImageGlobResult = import.meta.glob(
		'../../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const PROJECT_IMAGE_PATH = '../../../../assets/img/projects/';

	const getImage = (name: string) => getImageFromGlob(pictures, PROJECT_IMAGE_PATH, name);

	interface Props {
		entry: Project;
		relatedWork?: WorkEntry[];
	}

	let { entry, relatedWork = [] }: Props = $props();

	const imageData = $derived(getImage(entry.image));
</script>

{#snippet leadingImage()}
	{#if imageData}
		<enhanced:img
			src={imageData}
			sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
			alt={entry.title}
		/>
	{/if}
{/snippet}

<div class="project-entry" class:with-image={!!imageData}>
	<EntryHeader title={entry.title} />
	<div class="project-body">
		{#if imageData}
			<div class="image-block">
				{@render leadingImage()}
			</div>
		{/if}
		<article class="h-entry content-column">
			<div class="content">
				<BaseRichText>
					{@html entry.html}
				</BaseRichText>
				<div class="sep" aria-hidden="true"></div>
				<nav class="links" aria-label="Project links">
					{#each entry.links as link (link.url)}
						<a href={link.url} target="_blank" rel="noopener noreferrer external">{link.title}</a>
					{/each}
				</nav>
				{#if relatedWork.length > 0}
					<div class="related-work">
						<h3>Related Work</h3>
						<ul class="related-work-list">
							{#each relatedWork as work (work.slug)}
								<li>
									<BaseCard
										element="a"
										href={resolvePath(work.relativePath)}
										variant="default"
										class="withIcon"
									>
										<div class="header">
											<div class="info">
												<h4 class="name">{work.title}</h4>
											</div>
											<div class="external-link">
												<Icon icon="ph:arrow-up-right-bold" />
											</div>
										</div>
									</BaseCard>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</article>
	</div>
</div>

<style lang="postcss">
	.project-entry {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: stretch;
		gap: var(--m);

		.project-body {
			display: grid;
			width: 100%;
			align-items: start;
			gap: var(--m);
			grid-template-columns: 0.382fr 0.618fr;
			@media screen and (width <= 48rem) {
				grid-template-columns: 1fr;
			}
			.image-block {
				min-width: 0;
				border-radius: var(--border-radius);
				overflow: hidden;
				:global(picture),
				:global(picture img) {
					display: block;
					max-width: 100%;
					height: auto;
					border-radius: var(--border-radius);
				}
			}
			.content-column {
				min-width: 0;
			}
		}

		&:not(.with-image) .project-body {
			grid-template-columns: 1fr;
			.content-column {
				grid-column: 1;
			}
		}
	}
	article {
		> .content {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			:global(.rich-text) {
				margin: 0;
			}
			.sep {
				margin: var(--l) 0;
				width: 100%;
				height: 0;
				border: none;
				border-bottom: 1px solid var(--c-surface-accent);
			}
			.links {
				display: flex;
				flex-wrap: wrap;
				gap: var(--m);
				a {
					color: var(--c-font);
					font-size: var(--font-s);
					text-decoration: none;
				}
				a:hover {
					text-decoration: underline;
				}
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
				.related-work-list {
					display: flex;
					margin: 0;
					padding: 0;
					flex-direction: column;
					gap: var(--m);
					list-style: none;
					li {
						width: 100%;
					}
				}
			}
		}
	}
</style>
