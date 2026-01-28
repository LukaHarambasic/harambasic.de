<script lang="ts">
	import type { WorkEntry } from '$lib/types/workEntry';
	import type { Position } from '$lib/types/workEntry';
	import type { Project } from '$lib/types/project';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

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
						<enhanced:img
							src={imageData}
							sizes="(min-width:768px) 64px, 48px"
							alt={entry.title}
						/>
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

	{#if sortedPositions.length > 0}
		<div class="positions-content">
			{#each sortedPositions as position}
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

	{#if relatedProjects.length > 0}
		<div class="related-projects">
			<h3>Related Projects</h3>
			<ul>
				{#each relatedProjects as project}
					<li>
						<a href={project.relativePath}>{project.title}</a>
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
		margin-bottom: var(--l);
		align-items: center;
		gap: var(--m);
	}

	.company-icon {
		display: flex;
		width: 4rem;
		height: 4rem;
		border-radius: var(--border-radius-small);
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
		width: 100%;
		margin-bottom: var(--l);
		flex-direction: column;
		gap: var(--xl);
	}

	.position-section {
		display: flex;
		flex-direction: column;
		gap: var(--s);
		padding-bottom: var(--xl);
		border-bottom: 1px solid var(--c-surface-accent);
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
		flex-direction: column;
		align-items: flex-start;
		gap: var(--xs);
		flex: 1;
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
		text-transform: capitalize;
		font-style: italic;
		line-height: 1.5;
	}

	.position-dates {
		display: flex;
		gap: var(--xs);
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		line-height: 1.5;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.position-content {
		margin-top: var(--s);
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-m);
		line-height: 1.6;
	}

	.company-content {
		width: 100%;
		margin-bottom: var(--l);
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
		margin-top: var(--l);
		width: 100%;
		h3 {
			margin: 0 0 var(--s) 0;
			color: var(--c-font);
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
