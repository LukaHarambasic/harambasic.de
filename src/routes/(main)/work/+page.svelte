<script lang="ts">
	import type { PageData } from './$types';
	import type { WorkEntry } from '$lib/types/workEntry';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Hero from '$lib/components/Hero/Hero.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import Icon from '@iconify/svelte';
	import { getImageFromGlob, isSvgImage, type ImageGlobResult } from '$lib/util/images';
	import { formatDateDisplay, sortPositionsByDate } from '$lib/util/helper';

	const pictures: ImageGlobResult = import.meta.glob(
		'../../../assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const WORK_IMAGE_PATH = '../../../assets/img/work/';

	const getImage = (name: string) => getImageFromGlob(pictures, WORK_IMAGE_PATH, name);

	interface WorkCard {
		entry: WorkEntry;
		isCurrent: boolean;
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let entries = $derived((data.work || [[]])[0] || []);
	let workRelatedProjects = $derived(data.workRelatedProjects || {});

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

	const { current, past } = $derived(organizeEntries(entries));
</script>

<Entries path={data.url}>
	{#snippet entries()}
		<Hero
			title="Building products that matter for people & the energy transition"
			description="From Germany's COVID tracing app with 48M+ downloads to scaling Home Energy Management Systems from 0 to 1. I ship products, build automations, and occasionally write code."
		/>
		<div class="work-container">
			{#if current}
				{@const sortedPositions = sortPositionsByDate(current.entry.positions)}
				{@const relatedProjects = getRelatedProjects(current.entry)}
				<BaseCard
					element="a"
					href="/work/{current.entry.slug}"
					variant="featured"
					class="withIcon current-card"
					aria-label="View details for {current.entry.title}"
				>
					<div class="card-header">
						<div class="header-content">
							<div class="company-header">
								{#if current.entry.image && current.entry.image !== 'TODO'}
									{@const isSvg = isSvgImage(current.entry.image)}
									{@const imageData = isSvg ? null : getImage(current.entry.image)}
									{#if isSvg || imageData}
										<div class="company-logo">
											{#if isSvg}
												<img src="/work/{current.entry.image}" alt={current.entry.title} />
											{:else if imageData}
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
										{formatDateDisplay(position.startDate)} – {position.endDate
											? formatDateDisplay(position.endDate)
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
				</BaseCard>
			{/if}

			{#if past.length > 0}
				<div class="work-grid">
					{#each past as card}
						{@const sortedPositions = sortPositionsByDate(card.entry.positions)}
						{@const relatedProjects = getRelatedProjects(card.entry)}
						<BaseCard
							element="a"
							href="/work/{card.entry.slug}"
							variant="default"
							class="withIcon past-card"
							aria-label="View details for {card.entry.title}"
						>
							<div class="card-header">
								<div class="header-content">
									<div class="company-header">
										{#if card.entry.image && card.entry.image !== 'TODO'}
											{@const isSvg = isSvgImage(card.entry.image)}
											{@const imageData = isSvg ? null : getImage(card.entry.image)}
											{#if isSvg || imageData}
												<div class="company-logo">
													{#if isSvg}
														<img src="/work/{card.entry.image}" alt={card.entry.title} />
													{:else if imageData}
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
												{formatDateDisplay(position.startDate)} – {position.endDate
													? formatDateDisplay(position.endDate)
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
						</BaseCard>
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

	:global(.current-card) {
		margin: 0 auto;
		width: 61.8%;
		@media screen and (width <= 48rem) {
			width: 100%;
		}
		&:focus {
			outline: 2px solid var(--c-current-work-text);
			outline-offset: 2px;
		}
	}

	:global(.past-card) {
		width: 100%;
		&:focus {
			outline: 2px solid var(--c-font);
			outline-offset: 2px;
		}
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

	.work-grid :global(.past-card) {
		display: flex;
		min-height: 100%;
		flex-direction: column;
	}
</style>
