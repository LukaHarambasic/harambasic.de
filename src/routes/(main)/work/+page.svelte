<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkEntry } from '$lib/types/workEntry';
	import type { Position } from '$lib/types/workEntry';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Icon from '@iconify/svelte';

	// TODO: remove eager and only load images that got randomly selected
	const pictures = import.meta.glob(
		'../../../assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
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
		const image = pictures[`../../../assets/img/work/${name}`];
		if (!image) {
			return null;
		}
		return (image as any).default || null;
	};

	interface PositionEntry {
		position: Position;
		location: string;
		employmentType: string;
	}

	interface CompanyGroup {
		companyName: string;
		companySlug: string;
		companyImage: string | null;
		positions: PositionEntry[];
		earliestDate: Date;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const [entries = []] = data.work || [[]];

	// Group work entries by company and sort positions within each company
	const groupByCompany = (workEntries: WorkEntry[]): CompanyGroup[] => {
		const companyGroups: CompanyGroup[] = [];

		for (const entry of workEntries) {
			// Sort positions within this company by startDate (descending)
			const sortedPositions = [...entry.positions]
				.map((position) => ({
					position,
					location: entry.location,
					employmentType: entry.employmentType
				}))
				.sort((a, b) => {
					const dateA = new Date(a.position.startDate).getTime();
					const dateB = new Date(b.position.startDate).getTime();
					return dateB - dateA; // Descending order
				});

			// Find earliest date for sorting companies
			const earliestDate = sortedPositions.reduce((earliest, current) => {
				const currentDate = new Date(current.position.startDate);
				return currentDate < earliest ? currentDate : earliest;
			}, new Date(sortedPositions[0]?.position.startDate || Date.now()));

			companyGroups.push({
				companyName: entry.title,
				companySlug: entry.slug,
				companyImage: entry.image || null,
				positions: sortedPositions,
				earliestDate
			});
		}

		// Sort companies by earliest position date (descending - most recent first)
		return companyGroups.sort((a, b) => {
			return b.earliestDate.getTime() - a.earliestDate.getTime();
		});
	};

	// Format date for display
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	};

	const companyGroups = $derived(groupByCompany(entries));
</script>

<Entries path={data.url}>
	{#snippet entries()}
		<div class="timeline-container">
			<div class="timeline-line"></div>
			<div class="timeline-entries">
				{#each companyGroups as companyGroup}
					<div class="company-group">
						<div class="company-header">
							{#if getImage(companyGroup.companyImage)}
								<div class="company-logo">
									<enhanced:img
										src={getImage(companyGroup.companyImage)}
										sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
										alt={companyGroup.companyName}
									/>
								</div>
							{/if}
							<h2 class="company-title">{companyGroup.companyName}</h2>
							<a href="/work/{companyGroup.companySlug}" class="link-icon" aria-label="View details for {companyGroup.companyName}">
								<Icon icon="ph:link" />
							</a>
						</div>
						<div class="positions-list">
							{#each companyGroup.positions as positionEntry, positionIndex}
								<div class="position-entry">
									<div class="date-marker">
										<div class="date-dot"></div>
									</div>
									<div class="position-content">
										<div class="position-header">
											<h3 class="position-title">{positionEntry.position.title}</h3>
										</div>
										<div class="entry-meta">
											<span class="dates">
												{formatDate(positionEntry.position.startDate)} – {positionEntry.position.endDate ? formatDate(positionEntry.position.endDate) : 'Present'}
											</span>
											<span class="separator">•</span>
											<span class="location">{positionEntry.location}</span>
											<span class="separator">•</span>
											<span class="employment-type">{positionEntry.employmentType}</span>
										</div>
										<div class="entry-body rich-text">
											<!-- eslint-disable-next-line svelte/no-at-html-tags -->
											{@html positionEntry.position.content}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.timeline-container {
		position: relative;
		width: 100%;
		max-width: 90ch;
		margin: 0 auto;
		padding: var(--l) 0;
	}

	.timeline-line {
		position: absolute;
		left: 1.5rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--c-font-accent-dark);
		opacity: 0.6;
		@media screen and (width <= 48rem) {
			left: 1rem;
		}
	}

	.timeline-entries {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--xl);
	}

	.company-group {
		position: relative;
		margin-bottom: var(--xl);
		&:last-child {
			margin-bottom: 0;
		}
	}

	.company-header {
		display: flex;
		align-items: center;
		gap: var(--m);
		margin-bottom: var(--l);
		margin-left: 4rem;
		flex-wrap: wrap;
		@media screen and (width <= 48rem) {
			margin-left: 2.5rem;
		}
	}

	.company-title {
		margin: 0;
		font-family: var(--font-family);
		font-size: var(--font-xl);
		font-weight: 900;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
		color: var(--c-font);
		flex: 1;
	}

	.positions-list {
		display: flex;
		flex-direction: column;
		gap: var(--m);
		margin-left: 4rem;
		@media screen and (width <= 48rem) {
			margin-left: 2.5rem;
		}
	}

	.position-entry {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: var(--m);
	}

	.date-marker {
		position: absolute;
		left: -4rem;
		width: 3rem;
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		@media screen and (width <= 48rem) {
			left: -2.5rem;
			width: 2rem;
		}
	}

	.date-dot {
		position: relative;
		top: 0.25rem;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: var(--c-light);
		border: 2px solid var(--c-font-accent-dark);
		opacity: 0.8;
		z-index: 1;
		@media screen and (width <= 48rem) {
			width: 0.625rem;
			height: 0.625rem;
		}
	}

	.position-content {
		flex: 1;
	}

	.position-header {
		margin-bottom: var(--s);
	}

	.company-logo {
		width: 3rem;
		height: 3rem;
		flex-shrink: 0;
		border-radius: var(--border-radius);
		overflow: hidden;
		background: var(--c-light);
		display: flex;
		align-items: center;
		justify-content: center;
		:global(picture),
		:global(img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
		@media screen and (width <= 48rem) {
			width: 2.5rem;
			height: 2.5rem;
		}
	}

	.header-text {
		display: flex;
		align-items: baseline;
		gap: var(--xs);
		flex: 1;
		flex-wrap: wrap;
	}

	.position-title {
		margin: 0;
		font-family: var(--font-family);
		font-size: var(--font-l);
		font-weight: 700;
		line-height: 1.2;
		letter-spacing: var(--font-letter-spacing-headline);
		color: var(--c-font);
	}

	.link-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		color: var(--c-font-accent);
		text-decoration: none;
		border-radius: var(--border-radius);
		transition: var(--transition);
		flex-shrink: 0;
		:global(svg) {
			width: 1.25rem;
			height: 1.25rem;
		}
		&:hover {
			background: var(--c-light);
			color: var(--c-font);
		}
	}

	.entry-meta {
		display: flex;
		align-items: center;
		gap: var(--xs);
		margin-bottom: var(--m);
		font-size: var(--font-s);
		color: var(--c-font-accent);
		font-style: italic;
		flex-wrap: wrap;
	}

	.separator {
		color: var(--c-font-accent);
	}

	.entry-body {
		color: var(--c-font);
		line-height: 1.6;
		:global(p) {
			margin: 0 0 var(--m) 0;
			&:last-child {
				margin-bottom: 0;
			}
		}
		:global(ul),
		:global(ol) {
			margin: 0 0 var(--m) 0;
			padding-left: var(--l);
			&:last-child {
				margin-bottom: 0;
			}
		}
		:global(li) {
			margin-bottom: var(--xs);
			&:last-child {
				margin-bottom: 0;
			}
		}
		:global(strong) {
			font-weight: 700;
		}
		:global(em) {
			font-style: italic;
		}
	}

	.rich-text {
		:global(a) {
			color: var(--c-font);
			text-decoration: underline;
			&:hover {
				text-decoration: none;
			}
		}
	}
</style>