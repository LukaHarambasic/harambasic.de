<script lang="ts">
	import type { Project } from '$lib/types/project';
	import type { WorkEntry } from '$lib/types/workEntry';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
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

<article class="h-entry">
	{#if imageData}
		<enhanced:img
			src={imageData}
			sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
			alt={entry.title}
		/>
	{/if}
	<div class="content">
		<BaseRichText>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html entry.html}
		</BaseRichText>
		<ul class="tags">
			{#each entry.tags as tag}
				<li>
					<BaseTag {tag} />
				</li>
			{/each}
		</ul>
		<BaseRichText class="links">
			<ul>
				{#each entry.links as link}
					<li>
						<a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
					</li>
				{/each}
			</ul>
		</BaseRichText>
		{#if relatedWork.length > 0}
			<div class="related-work">
				<h3>Related Work</h3>
				<ul class="related-work-list">
					{#each relatedWork as work}
						<li>
							<BaseCard element="a" href={work.relativePath} variant="default" class="withIcon">
								<div class="card-header">
									<div class="header-content">
										<div class="company-header">
											<div class="company-info">
												<h4 class="company-name">{work.title}</h4>
											</div>
										</div>
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
			:global(.rich-text) {
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
