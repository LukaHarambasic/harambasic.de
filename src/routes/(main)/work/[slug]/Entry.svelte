<script lang="ts">
	import type { WorkEntry } from '$lib/types/workEntry';
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
		const image = pictures[`../../../../assets/img/work/${name}`];
		if (!image) {
			return {};
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (image as any).default || {};
	};

	interface Props {
		entry: WorkEntry;
		relatedProjects?: Project[];
	}

	let { entry, relatedProjects = [] }: Props = $props();

	// Format date for display
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	};
</script>

<article class="h-entry">
	<enhanced:img
		src={getImage(entry.image)}
		sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
		alt={entry.title}
	/>
	<div class="content">
		<div class="company-info">
			<h1>{entry.title}</h1>
			<p class="description">{entry.description}</p>
			<div class="meta">
				<span class="location">{entry.location}</span>
				<span class="employment-type">{entry.employmentType}</span>
			</div>
		</div>

		{#if entry.positions && entry.positions.length > 0}
			<div class="positions">
				<h2>Positions</h2>
				{#each entry.positions as position}
					<div class="position">
						<div class="position-header">
							<h3>{position.title}</h3>
							<div class="position-dates">
								<span>{formatDate(position.startDate)}</span>
								<span>–</span>
								<span>{position.endDate ? formatDate(position.endDate) : 'Present'}</span>
							</div>
						</div>
						<div class="position-content rich-text">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html position.content}
						</div>
					</div>
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
			<ul class="tags">
				{#each entry.tags as tag}
					<li>
						<BaseTag {tag} />
					</li>
				{/each}
			</ul>
		{/if}

		{#if relatedProjects.length > 0}
			<div class="related-projects">
				<h2>Related Projects</h2>
				<ul>
					{#each relatedProjects as project}
						<li>
							<a href={project.relativePath}>{project.title}</a>
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
			gap: var(--m);

			.company-info {
				h1 {
					margin: 0 0 var(--xs) 0;
					font-family: var(--font-family);
					font-size: var(--font-xl);
					font-weight: 900;
					line-height: 1.2;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				.description {
					margin: 0 0 var(--s) 0;
					font-size: var(--font-m);
					line-height: 1.5;
				}
				.meta {
					display: flex;
					gap: var(--s);
					color: var(--c-font-accent);
					font-size: var(--font-s);
					.location::after {
						margin-left: var(--s);
						content: '•';
					}
				}
			}

			.positions {
				width: 100%;
				h2 {
					margin: 0 0 var(--m) 0;
					font-family: var(--font-family);
					font-size: var(--font-l);
					font-weight: 900;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				.position {
					margin-bottom: var(--l);
					padding-bottom: var(--l);
					border-bottom: 1px solid var(--c-border);
					&:last-child {
						margin-bottom: 0;
						padding-bottom: 0;
						border-bottom: none;
					}
					.position-header {
						display: flex;
						margin-bottom: var(--s);
						justify-content: space-between;
						align-items: baseline;
						gap: var(--m);
						@media screen and (width <= 48rem) {
							flex-direction: column;
							align-items: flex-start;
						}
						h3 {
							margin: 0;
							font-family: var(--font-family);
							font-size: var(--font-m);
							font-weight: 700;
							letter-spacing: var(--font-letter-spacing-headline);
						}
						.position-dates {
							display: flex;
							gap: var(--xs);
							color: var(--c-font-accent);
							font-size: var(--font-s);
							white-space: nowrap;
						}
					}
					.position-content {
						margin-top: var(--s);
					}
				}
			}

			.company-content {
				width: 100%;
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
				margin-top: var(--m);
				width: 100%;
				h2 {
					margin: 0 0 var(--s) 0;
					font-family: var(--font-family);
					font-size: var(--font-l);
					font-weight: 900;
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
			}
		}
	}
</style>
