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

	interface WorkCard {
		entry: WorkEntry;
		isCurrent: boolean;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const [entries = []] = data.work || [[]];

	// Separate current and past entries, then sort
	const organizeEntries = (workEntries: WorkEntry[]): { current: WorkCard | null; past: WorkCard[] } => {
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
				const aLatest = Math.max(
					...a.entry.positions.map((p) => new Date(p.startDate).getTime())
				);
				const bLatest = Math.max(
					...b.entry.positions.map((p) => new Date(p.startDate).getTime())
				);
				return bLatest - aLatest;
			});

		return { current, past };
	};

	// Format date for display (MMM YYYY)
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
	};

	// Truncate description text
	const truncateDescription = (text: string, maxLength: number = 150): string => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trim() + '...';
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
				{@const positionCount = current.entry.positions.length}
				<div class="work-card current-card">
					<div class="current-badge">CURRENT</div>
					<div class="card-header">
						<h2 class="company-name">{current.entry.title}</h2>
						<a
							href="/work/{current.entry.slug}"
							class="external-link"
							aria-label="View details for {current.entry.title}"
						>
							<Icon icon="ph:arrow-up-right" />
						</a>
					</div>
					<div class="card-positions">
						{#each sortedPositions as position}
							<div class="position-row">
								<span class="position-title">{position.title}</span>
								<span class="position-separator">·</span>
								<span class="position-dates">
									{formatDate(position.startDate)} – {position.endDate ? formatDate(position.endDate) : 'Present'}
								</span>
							</div>
						{/each}
					</div>
					<div class="card-location">
						<Icon icon="ph:map-pin" class="location-icon" />
						<span>{current.entry.location}</span>
						{#if positionCount > 1}
							<span class="role-badge">{positionCount} ROLES</span>
						{/if}
					</div>
					{#if current.entry.description}
						<p class="card-description">{truncateDescription(current.entry.description)}</p>
					{/if}
					<a href="/work/{current.entry.slug}" class="highlights-link">
						{positionCount} highlight{positionCount !== 1 ? 's' : ''} →
					</a>
				</div>
			{/if}

			{#if past.length > 0}
				<div class="work-grid">
					{#each past as card}
						{@const sortedPositions = getSortedPositions(card.entry)}
						{@const positionCount = card.entry.positions.length}
						<div class="work-card past-card">
							<div class="card-header">
								<h2 class="company-name">{card.entry.title}</h2>
								<a
									href="/work/{card.entry.slug}"
									class="external-link"
									aria-label="View details for {card.entry.title}"
								>
									<Icon icon="ph:arrow-up-right" />
								</a>
							</div>
							<div class="card-positions">
								{#each sortedPositions as position}
									<div class="position-row">
										<span class="position-title">{position.title}</span>
										<span class="position-separator">·</span>
										<span class="position-dates">
											{formatDate(position.startDate)} – {position.endDate ? formatDate(position.endDate) : 'Present'}
										</span>
									</div>
								{/each}
							</div>
							<div class="card-location">
								<Icon icon="ph:map-pin" class="location-icon" />
								<span>{card.entry.location}</span>
								{#if positionCount > 1}
									<span class="role-badge">{positionCount} ROLES</span>
								{/if}
							</div>
							{#if card.entry.description}
								<p class="card-description">{truncateDescription(card.entry.description)}</p>
							{/if}
							<a href="/work/{card.entry.slug}" class="highlights-link">
								{positionCount} highlight{positionCount !== 1 ? 's' : ''} →
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.work-container {
		display: flex;
		flex-direction: column;
		gap: var(--l);
		width: 100%;
		max-width: var(--layout-xl);
		margin: 0 auto;
		padding: var(--l) 0;
	}

	.work-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: var(--l);
		background: var(--c-light);
		border: 1px solid var(--c-surface-accent);
		border-radius: var(--border-radius);
		box-shadow: var(--box-shadow);
		transition: var(--transition);
	}

	.current-card {
		width: 100%;
		border-width: 2px;
		border-color: var(--c-font);
		padding-top: calc(var(--l) + 1.5rem);
		&:hover {
			.external-link {
				transform: translateY(-2px) translateX(2px);
			}
		}
	}

	.past-card {
		width: 100%;
		&:hover {
			box-shadow:
				0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(0, 0, 0, 0.05),
				0 12px 24px rgba(0, 0, 0, 0.05);
			.external-link {
				transform: translateY(-2px) translateX(2px);
			}
		}
	}

	.current-badge {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.375rem var(--m);
		background: var(--c-backdrop);
		color: var(--c-light);
		font-family: var(--font-family);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-radius: var(--border-radius-small) 0 var(--border-radius-small) 0;
		z-index: 1;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: var(--l);
		gap: var(--m);
	}

	.company-name {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: var(--font-xl);
		font-weight: 700;
		line-height: 1.2;
		color: var(--c-font);
		flex: 1;
	}

	.current-card .company-name {
		font-size: 1.5rem;
	}

	.external-link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		color: var(--c-font);
		text-decoration: none;
		flex-shrink: 0;
		transition: var(--transition);
		:global(svg) {
			width: 1rem;
			height: 1rem;
			stroke-width: 1.5;
		}
		&:hover {
			transform: translateY(-2px) translateX(2px);
		}
	}

	.card-positions {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: var(--m);
	}

	.position-row {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		color: var(--c-font-accent-dark);
		line-height: 1.5;
	}

	.position-title {
		font-weight: 400;
	}

	.position-separator {
		color: var(--c-font-accent-dark);
	}

	.position-dates {
		color: var(--c-font-accent-dark);
	}

	.card-location {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-bottom: var(--m);
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		color: var(--c-font-accent-dark);
		line-height: 1.5;
		flex-wrap: wrap;
	}

	.location-icon {
		width: 1rem;
		height: 1rem;
		color: var(--c-font-accent-dark);
		flex-shrink: 0;
		:global(svg) {
			stroke-width: 1.5;
		}
	}

	.role-badge {
		margin-left: var(--xs);
		padding: 0.125rem 0.5rem;
		background: var(--c-surface);
		color: var(--c-font);
		font-family: var(--font-family);
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: var(--border-radius-small);
	}

	.card-description {
		margin: 0 0 var(--l) 0;
		padding-bottom: var(--m);
		border-bottom: 1px solid var(--c-surface-accent);
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 400;
		line-height: 1.6;
		color: var(--c-font-accent-dark);
	}

	.highlights-link {
		display: inline-flex;
		align-items: center;
		margin-top: auto;
		font-family: var(--font-family);
		font-size: var(--font-s);
		font-weight: 400;
		color: var(--c-font);
		text-decoration: none;
		transition: var(--transition);
		&:hover {
			opacity: 0.7;
		}
		:global(svg) {
			stroke-width: 1.5;
		}
	}

	.work-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--l);
		@media screen and (width <= 48rem) {
			grid-template-columns: 1fr;
		}
	}

	.work-grid .past-card {
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
</style>