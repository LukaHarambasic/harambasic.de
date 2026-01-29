<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkEntry } from '$lib/types/workEntry';
	import type { Position } from '$lib/types/workEntry';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Icon from '@iconify/svelte';

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
		const imagePath = `../../../assets/img/work/${name}`;
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

	interface WorkCard {
		entry: WorkEntry;
		isCurrent: boolean;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const [entries = []] = data.work || [[]];
	const workRelatedProjects = data.workRelatedProjects || {};

	// Helper function to get related projects for an entry
	const getRelatedProjects = (entry: WorkEntry): Array<{ slug: string; title: string }> => {
		return workRelatedProjects[entry.slug] || [];
	};

	// Separate current and past entries, then sort
	const organizeEntries = (
		workEntries: WorkEntry[]
	): { current: WorkCard | null; past: WorkCard[] } => {
		const cards: WorkCard[] = workEntries.map((entry) => {
			// Check if any position has endDate === null (current)
			const isCurrent = entry.positions.some((position) => position.endDate === null);
			return { entry, isCurrent };
		});

		const current = cards.find((card) => card.isCurrent) || null;
		const past = cards
			.filter((card) => !card.isCurrent)
			.sort((a, b) => {
				// Sort by most recent position start date
				const aLatest = Math.max(...a.entry.positions.map((p) => new Date(p.startDate).getTime()));
				const bLatest = Math.max(...b.entry.positions.map((p) => new Date(p.startDate).getTime()));
				return bLatest - aLatest;
			});

		return { current, past };
	};

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

	const { current, past } = $derived(organizeEntries(entries));
</script>

<Entries path={data.url}>
	{#snippet entries()}
		<div class="work-container">
			{#if current}
				{@const sortedPositions = getSortedPositions(current.entry)}
				{@const relatedProjects = getRelatedProjects(current.entry)}
				<a
					href="/work/{current.entry.slug}"
					class="work-card current-card"
					aria-label="View details for {current.entry.title}"
				>
					<div class="card-header">
						<div class="header-content">
							<div class="company-header">
								{#if current.entry.image && current.entry.image !== 'TODO'}
									{@const imageData = isSvg(current.entry.image)
										? true
										: getImage(current.entry.image)}
									{#if imageData}
										<div class="company-logo">
											{#if isSvg(current.entry.image)}
												<img src="/work/{current.entry.image}" alt={current.entry.title} />
											{:else}
												<enhanced:img
													src={imageData}
													sizes="(min-width:768px) 64px, 48px"
													alt={current.entry.title}
												/>
											{/if}
										</div>
									{/if}
								{/if}
								<div class="company-info">
									<h2 class="company-name">{current.entry.title}</h2>
									<div class="card-location">{current.entry.location}</div>
								</div>
							</div>
						</div>
						<div class="external-link">
							<Icon icon="ph:arrow-up-right-bold" />
						</div>
					</div>
					<div class="card-metadata">
						<div class="card-positions">
							{#each sortedPositions as position}
								<div class="position-row">
									<span class="position-title">{position.title}</span>
									<span class="position-dates">
										{formatDate(position.startDate)} – {position.endDate
											? formatDate(position.endDate)
											: 'Present'}
									</span>
								</div>
							{/each}
						</div>
					</div>
					<div class="card-description">
						<p>{current.entry.description}</p>
					</div>
					<div class="card-footer">
						{#if relatedProjects.length > 0}
							<span class="related-projects">
								{#each relatedProjects as project, index}
									<span>{project.title}</span>
									{#if index < relatedProjects.length - 1},
									{/if}
								{/each}
							</span>
						{:else}
							<span class="no-projects">No projects</span>
						{/if}
					</div>
				</a>
			{/if}

			{#if past.length > 0}
				<div class="work-grid">
					{#each past as card}
						{@const sortedPositions = getSortedPositions(card.entry)}
						{@const relatedProjects = getRelatedProjects(card.entry)}
						<a
							href="/work/{card.entry.slug}"
							class="work-card past-card"
							aria-label="View details for {card.entry.title}"
						>
							<div class="card-header">
								<div class="header-content">
									<div class="company-header">
										{#if card.entry.image && card.entry.image !== 'TODO'}
											{@const imageData = isSvg(card.entry.image)
												? true
												: getImage(card.entry.image)}
											{#if imageData}
												<div class="company-logo">
													{#if isSvg(card.entry.image)}
														<img src="/work/{card.entry.image}" alt={card.entry.title} />
													{:else}
														<enhanced:img
															src={imageData}
															sizes="(min-width:768px) 64px, 48px"
															alt={card.entry.title}
														/>
													{/if}
												</div>
											{/if}
										{/if}
										<div class="company-info">
											<h2 class="company-name">{card.entry.title}</h2>
											<div class="card-location">{card.entry.location}</div>
										</div>
									</div>
								</div>
								<div class="external-link">
									<Icon icon="ph:arrow-up-right-bold" />
								</div>
							</div>
							<div class="card-metadata">
								<div class="card-positions">
									{#each sortedPositions as position}
										<div class="position-row">
											<span class="position-title">{position.title}</span>
											<span class="position-dates">
												{formatDate(position.startDate)} – {position.endDate
													? formatDate(position.endDate)
													: 'Present'}
											</span>
										</div>
									{/each}
								</div>
							</div>
							<div class="card-description">
								<p>{card.entry.description}</p>
							</div>
							<div class="card-footer">
								{#if relatedProjects.length > 0}
									<span class="related-projects">
										{#each relatedProjects as project, index}
											<span>{project.title}</span>
											{#if index < relatedProjects.length - 1},
											{/if}
										{/each}
									</span>
								{:else}
									<span class="no-projects">No projects</span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.work-container {
		display: flex;
		margin: 0 auto;
		padding: var(--xl) 0;
		width: 100%;
		max-width: var(--layout-xl);
		flex-direction: column;
		gap: var(--xl);
	}

	.work-card {
		display: flex;
		position: relative;
		padding: var(--l);
		border: 1px solid var(--c-surface-accent);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		background: var(--c-light);
		flex-direction: column;
		gap: 0;
		color: inherit;
		text-decoration: none;
		transition: var(--transition);
		cursor: pointer;
	}

	.current-card {
		margin: 0 auto;
		width: 61.8%;
		border-width: 2px;
		border-color: rgba(255, 255, 255, 0.2);
		background: var(--c-current-work-bg);
		@media screen and (width <= 48rem) {
			width: 100%;
		}
		&:hover {
			transform: scale(1.02);
			.external-link {
				transform: translateY(-2px) translateX(2px);
			}
		}
		&:focus {
			outline: 2px solid var(--c-current-work-text);
			outline-offset: 2px;
		}
	}

	.past-card {
		width: 100%;
		&:hover {
			transform: scale(1.02);
			.external-link {
				transform: translateY(-2px) translateX(2px);
			}
		}
		&:focus {
			outline: 2px solid var(--c-font);
			outline-offset: 2px;
		}
	}

	.card-header {
		display: flex;
		margin-bottom: var(--m);
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--m);
	}

	.header-content {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: var(--xs);
	}

	.company-header {
		display: flex;
		align-items: center;
		gap: var(--m);
	}

	.company-info {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0;
	}

	.company-logo {
		display: flex;
		width: 3rem;
		height: 3rem;
		border-radius: var(--border-radius-small);
		background: var(--c-font-accent-super-light);
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

	.current-card .company-logo {
		background: rgba(255, 255, 255, 0.1);
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

	.current-card .company-name {
		color: var(--c-current-work-text);
		font-size: 1.5rem;
	}

	.external-link {
		display: flex;
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

	.current-card .external-link {
		color: var(--c-current-work-text);
	}

	.card-metadata {
		margin-bottom: var(--m);
	}

	.card-location {
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
		line-height: 1.5;
		white-space: nowrap;
	}

	.current-card .card-location {
		color: rgba(255, 255, 255, 0.8);
	}

	.card-positions {
		display: flex;
		flex-direction: column;
		gap: var(--xs);
	}

	.position-row {
		display: grid;
		align-items: baseline;
		gap: var(--m);
		grid-template-columns: 1fr auto;
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		line-height: 1.5;
	}

	.current-card .position-row {
		color: rgba(255, 255, 255, 0.8);
	}

	.position-title {
		font-weight: 500;
	}

	.position-dates {
		color: var(--c-font-accent-dark);
		font-weight: 400;
		white-space: nowrap;
	}

	.current-card .position-dates {
		color: rgba(255, 255, 255, 0.8);
	}

	.card-description {
		margin-bottom: var(--m);
		p {
			margin: 0;
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 400;
			line-height: 1.5;
		}
	}

	.current-card .card-description p {
		color: var(--c-current-work-text);
	}

	.card-footer {
		margin-top: auto;
		padding-top: var(--m);
		border-top: 1px solid var(--c-surface-accent);
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		line-height: 1.5;
	}

	.current-card .card-footer {
		border-top-color: rgba(255, 255, 255, 0.2);
		color: var(--c-current-work-text);
	}

	.related-projects {
		color: var(--c-font-accent-dark);
	}

	.current-card .related-projects {
		color: var(--c-current-work-text);
	}

	.no-projects {
		color: var(--c-font-accent-dark);
	}

	.current-card .no-projects {
		color: var(--c-current-work-text);
	}

	.work-grid {
		display: grid;
		gap: var(--l);
		grid-template-columns: repeat(2, 1fr);
		@media screen and (width <= 48rem) {
			gap: var(--l);
			grid-template-columns: 1fr;
		}
	}

	.work-grid .past-card {
		display: flex;
		min-height: 100%;
		flex-direction: column;
	}
</style>
