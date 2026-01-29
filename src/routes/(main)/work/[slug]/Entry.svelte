<script lang="ts">
	import type { WorkEntry } from '$lib/types/workEntry';
	import type { Position } from '$lib/types/workEntry';
	import type { Project } from '$lib/types/project';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import Icon from '@iconify/svelte';

	const pictures = import.meta.glob(
		'../../../../assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const projectPictures = import.meta.glob(
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
		if (!name || name === 'TODO') {
			return null;
		}
		const imagePath = `../../../../assets/img/work/${name}`;
		const image = pictures[imagePath];
		if (!image) {
			return null;
		}
		const imageData = (image as any).default;
		if (!imageData || typeof imageData !== 'object' || Object.keys(imageData).length === 0) {
			return null;
		}
		return imageData;
	};

	const getProjectImage = (name: string) => {
		if (!name || name === 'TODO') {
			return null;
		}
		const imagePath = `../../../../assets/img/projects/${name}`;
		const image = projectPictures[imagePath];
		if (!image) {
			return null;
		}
		const imageData = (image as any).default;
		if (!imageData || typeof imageData !== 'object' || Object.keys(imageData).length === 0) {
			return null;
		}
		return imageData;
	};

	const isSvg = (name: string) => {
		return name.endsWith('.svg');
	};

	interface Props {
		entry: WorkEntry;
		relatedProjects?: Project[];
	}

	let { entry, relatedProjects = [] }: Props = $props();

	// Format date for display (MMM YYYY)
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	};

	// Get sorted positions for display (most recent first)
	const getSortedPositions = (entry: WorkEntry): Position[] => {
		return [...entry.positions].sort((a, b) => {
			const dateA = new Date(a.startDate).getTime();
			const dateB = new Date(b.startDate).getTime();
			return dateB - dateA;
		});
	};

	const sortedPositions = $derived(getSortedPositions(entry));
	const firstPosition = $derived(sortedPositions[0] || null);
</script>

<article class="h-entry work-entry">
	<header class="company-header">
		{#if entry.image && entry.image !== 'TODO'}
			{@const imageData = isSvg(entry.image) ? true : getImage(entry.image)}
			{#if imageData}
				<div class="company-icon">
					{#if isSvg(entry.image)}
						<img src="/work/{entry.image}" alt={entry.title} />
					{:else}
						<enhanced:img src={imageData} sizes="(min-width:768px) 64px, 48px" alt={entry.title} />
					{/if}
				</div>
			{/if}
		{/if}
		<div class="company-info">
			<div class="company-name">{entry.title}</div>
			<div class="location">{entry.location}</div>
		</div>
	</header>

	{#if entry.description}
		<div class="company-description">
			<p>{entry.description}</p>
		</div>
	{/if}

	{#if relatedProjects.length > 0}
		<div class="related-projects">
			<div class="projects-grid" data-count={relatedProjects.length}>
				{#each relatedProjects as project}
					{@const projectImageData = getProjectImage(project.image)}
					<a href={project.relativePath} class="project-card">
						{#if projectImageData}
							<div class="project-image">
								<enhanced:img
									src={projectImageData}
									sizes="(min-width:768px) 400px, (min-width:480px) 50vw, 100vw"
									alt={project.imageAlt || project.title}
								/>
							</div>
						{/if}
						<div class="project-content">
							<h4 class="project-title">{project.title}</h4>
							{#if project.description}
								<p class="project-description">{project.description}</p>
							{/if}
						</div>
						<div class="external-link">
							<Icon icon="ph:arrow-up-right-bold" />
						</div>
					</a>
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
					<span>{formatDate(firstPosition.startDate)}</span>
					<span>–</span>
					<span>{firstPosition.endDate ? formatDate(firstPosition.endDate) : 'Present'}</span>
				</div>
			</header>
			<div class="position-content rich-text">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html firstPosition.content}
			</div>
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
							<span>{formatDate(position.startDate)}</span>
							<span>–</span>
							<span>{position.endDate ? formatDate(position.endDate) : 'Present'}</span>
						</div>
					</header>
					<div class="position-content rich-text">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html position.content}
					</div>
				</section>
			{/each}
		</div>
	{/if}

	{#if entry.html}
		<div class="company-content rich-text">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html entry.html}
		</div>
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
		max-width: calc(var(--layout-xl) * 0.618);
		flex-direction: column;
		align-items: flex-start;
		@media screen and (width <= 48rem) {
			max-width: 100%;
		}
	}

	.company-header {
		display: flex;
		margin-bottom: var(--m);
		align-items: center;
		gap: var(--m);
	}

	.company-icon {
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

	.company-info {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--xs);
	}

	.company-name {
		margin: 0;
		color: var(--c-font);
		font-family: var(--font-family);
		font-size: var(--font-xl);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
	}

	.location {
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
		line-height: 1.5;
	}

	.company-description {
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

	.company-content {
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
		&[data-count='1'] {
			grid-template-columns: 1fr;
			.project-card {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				@media screen and (width <= 48rem) {
					flex-direction: column;
				}
				.project-image {
					width: 8rem;
					min-width: 8rem;
					aspect-ratio: 1 / 1;
					@media screen and (width <= 48rem) {
						width: 100%;
						min-width: 0;
						aspect-ratio: 16 / 9;
					}
				}
				.project-content {
					flex: 1;
					justify-content: flex-start;
				}
			}
		}
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

	.project-card {
		display: flex;
		position: relative;
		border: 1px solid var(--c-surface-accent);
		border-radius: var(--border-radius);
		background: var(--c-surface);
		flex-direction: column;
		gap: 0;
		color: inherit;
		text-decoration: none;
		transition: var(--transition);
		cursor: pointer;
		overflow: hidden;
		&:hover {
			transform: translateY(-2px);
			.external-link {
				transform: translateY(-2px) translateX(2px);
			}
		}
		&:focus {
			outline: 2px solid var(--c-font);
			outline-offset: 2px;
		}
	}

	.project-image {
		display: flex;
		position: relative;
		width: 100%;
		background: var(--c-surface-accent);
		overflow: hidden;
		aspect-ratio: 16 / 9;
		:global(picture),
		:global(img) {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform var(--transition);
		}
	}

	.project-content {
		display: flex;
		padding: var(--l);
		flex-direction: column;
		gap: var(--xs);
	}

	.external-link {
		display: flex;
		position: absolute;
		top: var(--m);
		right: var(--m);
		z-index: 10;
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
		color: var(--c-font);
		transition: var(--transition);
		pointer-events: none;
		:global(svg) {
			width: 1rem;
			height: 1rem;
		}
	}

	.project-title {
		margin: 0;
		color: var(--c-font);
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: var(--font-letter-spacing-headline);
	}

	.project-description {
		margin: 0;
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		line-height: 1.5;
	}

	.rich-text {
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
</style>
