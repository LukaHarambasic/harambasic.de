<script lang="ts">
	import type { WorkEntry } from '$lib/types/workEntry';
	import type { Project } from '$lib/types/project';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import EntryHeader from '$lib/components/EntryHeader/EntryHeader.svelte';
	import Icon from '@iconify/svelte';
	import { getImageFromGlob, isSvgImage, type ImageGlobResult } from '$lib/util/images';
	import { formatDateDisplay, sortPositionsByDate } from '$lib/util/helper';

	const pictures: ImageGlobResult = import.meta.glob(
		'../../../../assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const projectPictures: ImageGlobResult = import.meta.glob(
		'../../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const WORK_IMAGE_PATH = '../../../../assets/img/work/';
	const PROJECT_IMAGE_PATH = '../../../../assets/img/projects/';

	const getImage = (name: string) => getImageFromGlob(pictures, WORK_IMAGE_PATH, name);

	const getProjectImage = (name: string) =>
		getImageFromGlob(projectPictures, PROJECT_IMAGE_PATH, name);

	interface Props {
		entry: WorkEntry;
		relatedProjects?: Project[];
	}

	let { entry, relatedProjects = [] }: Props = $props();

	const sortedPositions = $derived(sortPositionsByDate(entry.positions));
	const firstPosition = $derived(sortedPositions[0] || null);

	const hasLeadingContent = $derived(
		Boolean(
			entry.image && entry.image !== 'TODO' && (isSvgImage(entry.image) || getImage(entry.image))
		)
	);
</script>

{#snippet leadingIcon()}
	{@const isSvg = entry.image && isSvgImage(entry.image)}
	{@const imageData = !isSvg && entry.image ? getImage(entry.image) : null}
	{#if isSvg || imageData}
		<div class="icon">
			{#if isSvg}
				<img src="/work/{entry.image}" alt={entry.title} />
			{:else if imageData}
				<enhanced:img src={imageData} sizes="(min-width:768px) 64px, 48px" alt={entry.title} />
			{/if}
		</div>
	{/if}
{/snippet}

<article class="h-entry work-entry">
	<EntryHeader
		title={entry.title}
		leading={hasLeadingContent ? leadingIcon : undefined}
		meta={entry.location}
		leadingPosition="inline"
	/>

	{#if entry.description}
		<div class="description">
			<p>{entry.description}</p>
		</div>
	{/if}

	{#if relatedProjects.length > 0}
		<div class="related-projects">
			<div class="projects-grid" data-count={relatedProjects.length}>
				{#each relatedProjects as project}
					{@const projectImageData = getProjectImage(project.image)}
					<BaseCard
						element="a"
						href={project.relativePath}
						variant="default"
						class="image noSpacing highlighted"
					>
						<div class="external-link">
							<Icon icon="ph:arrow-up-right-bold" />
						</div>
						{#if projectImageData}
							<div class="image-wrapper">
								<div class="main-img">
									<enhanced:img
										src={projectImageData}
										sizes="(min-width:768px) 400px, (min-width:480px) 50vw, 100vw"
										alt={project.imageAlt || project.title}
									/>
								</div>
							</div>
						{/if}
						<div class="content">
							<strong>{project.title}</strong>
							{#if project.description}
								<p>{project.description}</p>
							{/if}
						</div>
					</BaseCard>
				{/each}
			</div>
		</div>
	{/if}

	{#if firstPosition}
		<section class="position-section first-position">
			<header class="position-header">
				<div class="position-title-group">
					<h2 class="position-title">{firstPosition.title}</h2>
					{#if firstPosition.employmentType}
						<div class="employment-type">{firstPosition.employmentType}</div>
					{/if}
				</div>
				<div class="position-dates">
					<span>{formatDateDisplay(firstPosition.startDate)}</span>
					<span>–</span>
					<span>{firstPosition.endDate ? formatDateDisplay(firstPosition.endDate) : 'Present'}</span
					>
				</div>
			</header>
			<BaseRichText class="position-content">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html firstPosition.content}
			</BaseRichText>
		</section>
	{/if}

	{#if sortedPositions.length > 1}
		<div class="positions-content">
			{#each sortedPositions.slice(1) as position}
				<section class="position-section">
					<header class="position-header">
						<div class="position-title-group">
							<h2 class="position-title">{position.title}</h2>
							{#if position.employmentType}
								<div class="employment-type">{position.employmentType}</div>
							{/if}
						</div>
						<div class="position-dates">
							<span>{formatDateDisplay(position.startDate)}</span>
							<span>–</span>
							<span>{position.endDate ? formatDateDisplay(position.endDate) : 'Present'}</span>
						</div>
					</header>
					<BaseRichText class="position-content">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html position.content}
					</BaseRichText>
				</section>
			{/each}
		</div>
	{/if}

	{#if entry.html}
		<BaseRichText class="content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html entry.html}
		</BaseRichText>
	{/if}

	{#if entry.tags && entry.tags.length > 0}
		<div class="tags-section">
			<ul class="tags">
				{#each entry.tags as tag}
					<li>
						<BaseTag {tag} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</article>

<style lang="postcss">
	article {
		display: flex;
		margin: 0 auto;
		padding: var(--xl) 0;
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
		.icon {
			display: flex;
			width: 4rem;
			height: 4rem;
			flex-shrink: 0;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			overflow: hidden;
			img,
			:global(enhanced-img) {
				display: block;
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100%;
				border-radius: var(--border-radius-small);
				object-fit: contain;
			}
		}
		.description {
			margin-bottom: var(--l);
			p {
				margin: 0;
				color: var(--c-font-accent-dark);
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 400;
				line-height: 1.6;
			}
		}
		.positions-content {
			display: flex;
			margin-bottom: var(--l);
			width: 100%;
			flex-direction: column;
			gap: var(--l);
		}
		.position-section {
			display: flex;
			margin-bottom: var(--l);
			padding-bottom: var(--l);
			border-bottom: 1px solid var(--c-surface-accent);
			flex-direction: column;
			gap: var(--s);
			&.first-position {
				margin-top: var(--l);
				border-bottom: none;
			}
			&:last-child {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
		.position-header {
			display: flex;
			margin-bottom: var(--s);
			justify-content: space-between;
			align-items: flex-start;
			gap: var(--m);
			@media screen and (width <= 48rem) {
				flex-direction: column;
				align-items: flex-start;
				gap: var(--xs);
			}
		}
		.position-title-group {
			display: flex;
			flex: 1;
			flex-direction: column;
			align-items: flex-start;
			gap: var(--xs);
		}
		.position-title {
			margin: 0;
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-l);
			font-weight: 900;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		.employment-type {
			margin: 0;
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-s);
			font-weight: 400;
			font-style: italic;
			line-height: 1.5;
			text-transform: capitalize;
		}
		.position-dates {
			display: flex;
			flex-shrink: 0;
			gap: var(--xs);
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-s);
			font-weight: 400;
			line-height: 1.5;
			white-space: nowrap;
		}
		.position-content {
			margin-top: var(--s);
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-m);
			line-height: 1.6;
		}
		.content {
			margin-bottom: var(--l);
			width: 100%;
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-m);
			line-height: 1.6;
		}
		.tags-section {
			margin-bottom: var(--l);
		}
		.tags {
			display: flex;
			margin: 0;
			flex-grow: 1;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: flex-start;
			gap: var(--xs);
		}
		.related-projects {
			margin-bottom: var(--xl);
			width: 100%;
		}
		.projects-grid {
			display: grid;
			gap: var(--l);
			grid-template-columns: 1fr;
			@media screen and (width > 48rem) {
				&[data-count='2'],
				&[data-count='3'] {
					grid-template-columns: repeat(2, 1fr);
				}
			}
			@media screen and (width > 62rem) {
				&[data-count='3'] {
					grid-template-columns: repeat(3, 1fr);
				}
			}
		}
		:global(.rich-text) {
			margin: 0;
			:global(p) {
				margin: 0 0 var(--m) 0;
			}
			:global(p:last-child) {
				margin-bottom: 0;
			}
			:global(ul),
			:global(ol) {
				margin: 0 0 var(--m) 0;
				padding-left: var(--l);
			}
			:global(ul:last-child),
			:global(ol:last-child) {
				margin-bottom: 0;
			}
			:global(li) {
				margin-bottom: var(--xs);
			}
			:global(li:last-child) {
				margin-bottom: 0;
			}
			:global(h1),
			:global(h2),
			:global(h3),
			:global(h4),
			:global(h5),
			:global(h6) {
				margin: var(--l) 0 var(--m) 0;
				font-family: var(--font-family);
				font-weight: 900;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			:global(h1:first-child),
			:global(h2:first-child),
			:global(h3:first-child),
			:global(h4:first-child),
			:global(h5:first-child),
			:global(h6:first-child) {
				margin-top: 0;
			}
			:global(h2) {
				font-size: var(--font-l);
			}
			:global(h3) {
				font-size: var(--font-m);
			}
			:global(a) {
				color: var(--c-font);
				text-decoration: underline;
			}
			:global(a:hover) {
				text-decoration: none;
			}
			:global(strong) {
				font-weight: 700;
			}
			:global(em) {
				font-style: italic;
			}
			:global(code) {
				padding: var(--xxs) var(--xs);
				border-radius: var(--border-radius-small);
				background: var(--c-surface-accent);
				font-family: var(--font-family-code);
				font-size: 0.9em;
			}
			:global(pre) {
				padding: var(--m);
				border-radius: var(--border-radius);
				background: var(--c-surface-accent);
				overflow-x: auto;
			}
			:global(pre code) {
				padding: 0;
				background: none;
			}
		}
	}
</style>
