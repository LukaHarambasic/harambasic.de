<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { PageData } from './$types';
	import type { Project } from '$lib/types/project';
	import { filterAndSort } from '$lib/data/projects/helper';
	import { ProjectSortProperty, ProjectStatus, SortDirection } from '$lib/types/enums';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Entries from '$lib/components/Entries/Entries.svelte';
	import EntriesSorter from '$lib/components/Entries/EntriesSorter.svelte';
	import EntriesTags from '$lib/components/Entries/EntriesTags.svelte';
	import EntriesFilter from '$lib/components/Entries/EntriesFilter.svelte';
	import EntriesSidebar from '$lib/components/Entries/EntriesSidebar.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';
	import BaseModal from '$lib/components/Base/BaseModal.svelte';
	import Icon from '@iconify/svelte';
	import BaseStatus from '$lib/components/Base/BaseStatus.svelte';

	// TODO: remove eager and only load images that got randomly selected
	const pictures = import.meta.glob(
		'../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../../assets/img/projects/${name}`];
		if (!image) {
			return {};
		}
		return image.default;
	};

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const [entries, tags] = data.projects;
	const path = data.path;

	let filterTagSlug = $state('all');

	let filterStatus;
	run(() => {
		filterStatus = ProjectStatus.All;
	});
	let sortProperty;
	run(() => {
		sortProperty = ProjectSortProperty.Priority;
	});
	let sortDirection;
	run(() => {
		sortDirection = SortDirection.Desc;
	});
	let filteredAndSorted = $derived(
		filterAndSort(entries, filterTagSlug, filterStatus, sortProperty, sortDirection)
	);

	let activeProject: Project | undefined = $state();

	function onProperty(event: { detail: ProjectSortProperty }) {
		sortProperty = event.detail;
	}

	function onDirection(event: { detail: SortDirection }) {
		sortDirection = event.detail;
	}

	function onTag(event: { detail: string }) {
		filterTagSlug = event.detail;
	}

	function onStatus(event: { detail: ProjectStatus }) {
		filterStatus = event.detail;
	}

	// For full static rendering searchparams has to be accessed in onMount
	onMount(() => {
		filterTagSlug = $page.url.searchParams.get('tag') || 'all';
		filterStatus = ($page.url.searchParams.get('status') as ProjectStatus) || ProjectStatus.All;
		sortProperty =
			($page.url.searchParams.get('property') as ProjectSortProperty) ||
			ProjectSortProperty.Priority;
		sortDirection =
			($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc;
	});

	let baseModalComponent = $state();

	function openModal(project: Project) {
		activeProject = project;
		baseModalComponent?.openModal();
	}
</script>

<Entries {path}>
	{#snippet sidebar()}
		<EntriesSidebar>
			<EntriesSorter
				propertiesEnum={ProjectSortProperty}
				propertiesDefault={ProjectSortProperty.Priority}
				on:propertyChange={onProperty}
				on:directionChange={onDirection}
			/>
			<EntriesFilter statusEnum={ProjectStatus} on:statusChange={onStatus} />
			<EntriesTags {tags} on:tagChange={onTag} />
		</EntriesSidebar>
	{/snippet}
	{#snippet entries()}
		<div class="entries">
			{#each filteredAndSorted as entry, index}
				<button
					class="h-feed entry card no-spacing"
					data-highlighted={index < 4}
					onclick={() => openModal(entry)}
				>
					{#if index < 4}
						<enhanced:img
							src={getImage(entry.image)}
							sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
							alt={entry.title}
						/>
					{/if}
					<div class="content">
						<div class="title">
							<strong>{entry.title}</strong>
							<BaseStatus status={entry.status} />
						</div>
						<p>{entry.description}</p>
						<ul class="tags">
							{#each entry.tags as tag}
								<li>
									<BaseTag {tag} />
								</li>
							{/each}
						</ul>
					</div>
					<Icon class="arrow" icon="ph:arrow-circle-right-bold" />
				</button>
			{/each}
		</div>
	{/snippet}
</Entries>

<!-- This is not in the normal dom flow -->
<BaseModal bind:this={baseModalComponent}>
	{#if activeProject}
		<div class="modal">
			<enhanced:img
				src={getImage(activeProject.image)}
				sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
				alt={activeProject.title}
			/>
			<div class="content">
				<h2>
					{activeProject.title}
					<BaseStatus status={activeProject.status} />
				</h2>
				<ul class="tags">
					{#each activeProject.tags as tag}
						<li>
							<BaseTag {tag} />
						</li>
					{/each}
				</ul>
				<div class="rich-text">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html activeProject.html}
				</div>
				<ul class="links rich-text">
					{#each activeProject.links as link}
						<li>
							<a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
</BaseModal>

<style lang="postcss">
	.entries {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--l);
		@media screen and (max-width: 62rem) {
			grid-template-columns: 1fr;
		}
		.entry {
			position: relative;
			display: flex;
			position: relative;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			transition: var(--transition);
			height: 100%;
			color: var(--c-font);
			text-decoration: none;
			&[data-highlighted='false'] {
				grid-column: span 2;
			}
			&[data-highlighted='true'] {
				@media screen and (max-width: 62rem) {
					grid-column: span 2;
				}
			}
			&:hover {
				transform: scale(0.97);
				cursor: pointer;
				img {
					filter: grayscale(0);
					opacity: 1;
				}
				:global(.arrow) {
					opacity: 1;
				}
			}
			> picture {
				width: 100%;
				img {
					width: 100%;
					height: inherit;
					border-radius: var(--border-radius) var(--border-radius) 0 0;
					aspect-ratio: 1 / 1;
					filter: grayscale(1);
					opacity: 0.5;
					@media screen and (max-width: 32rem) {
						border-radius: var(--border-radius) var(--border-radius) 0 0;
					}
				}
			}
			> .content {
				padding: var(--l);
				strong {
					display: inline;
					margin: 0 0 var(--xxs) 0;
					font-weight: 900;
					font-size: var(--font-m);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
				p {
					margin: 0 0 var(--s) 0;
					line-height: 1.5;
					font-size: var(--font-m);
				}
				.tags {
					flex-base: 100%;
					display: flex;
					flex-grow: 1;
					flex-direction: row;
					flex-wrap: wrap;
					align-content: stretch;
					justify-content: flex-start;
					align-items: flex-start;
					gap: var(--xs);
				}
			}
			:global(.arrow) {
				color: var(--c-font-accent-dark);
				size: var(--l);
				position: absolute;
				top: var(--m);
				right: calc((-1) * var(--m));
				opacity: 0;
				transition: var(--transition);
				border: 4px solid var(--c-light);
				border-radius: 100%;
				background: var(--c-light);
				box-shadow:
					0 1px 2px rgba(0, 0, 0, 0.03),
					0 2px 4px rgba(0, 0, 0, 0.03),
					0 4px 8px rgba(0, 0, 0, 0.03),
					0 8px 16px rgba(0, 0, 0, 0.03),
					0 16px 32px rgba(0, 0, 0, 0.03),
					0 32px 64px rgba(0, 0, 0, 0.03);
			}
		}
	}
	.modal {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		@media screen and (max-width: 64rem) {
			flex-direction: column;
		}
		> picture {
			size: 20rem;
			@media screen and (max-width: 48rem) {
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
			align-content: flex-start;
			align-items: flex-start;
			h2 {
				font-weight: 900;
				font-size: var(--font-xl);
				line-height: 1.2;
				font-family: var(--font-family);
				letter-spacing: var(--font-letter-spacing-headline);
				margin: 0 0 0 0;
			}
			.tags {
				display: flex;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--xs);
				margin: 0 0 var(--m) 0;
			}
			.rich-text {
				margin: 0 0 var(--m) 0;
			}
			.links {
				flex-base: 100%;
				display: flex;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--m);
			}
		}
	}
</style>
