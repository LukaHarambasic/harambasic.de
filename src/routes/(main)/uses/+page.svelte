<script lang="ts">
	import Entries from '$lib/components/Entries/Entries.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { sortDate } from '$lib/util/helper';
	import { UsesEntryStatus } from '$lib/types/enums';

	const pictures = import.meta.glob(
		'../../../assets/img/uses/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../../assets/img/uses/${name}`];
		if (!image) {
			return {};
		}
		return image.default;
	};

	const isSvg = (name: string) => {
		return name.endsWith('.svg');
	};

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const [usesEntries, tags] = data.uses;
	const path = data.path;

	interface GroupedEntries {
		title: string;
		entries: typeof usesEntries;
	}

	const groupedEntriesOrder = ['Essentials', 'Hardware', 'Software', 'Development'];

	const activeEntries = usesEntries.filter((entry) => entry.status === UsesEntryStatus.Active);
	const inactiveEntries = usesEntries.filter((entry) => entry.status === UsesEntryStatus.Inactive);

	const activeGroupedEntries: GroupedEntries[] = tags
		.map((tag) => ({
			title: tag.display,
			entries: activeEntries
				.filter((entry) => entry.tags.some((entryTag) => entryTag.slug === tag.slug))
				.sort((a, b) => sortDate(b.published.raw, a.published.raw))
		}))
		.filter((group) => group.entries.length > 0)
		.sort((a, b) => {
			const indexA = groupedEntriesOrder.indexOf(a.title);
			const indexB = groupedEntriesOrder.indexOf(b.title);
			if (indexA === -1 && indexB === -1) return 0;
			if (indexA === -1) return 1;
			if (indexB === -1) return -1;
			return indexA - indexB;
		});
</script>

<Entries {path}>
	{#snippet entries()}
		<div class="wrapper">
			{#each activeGroupedEntries as group}
				<div class="group">
					<h2>{group.title}</h2>
					<ul class="entries">
						{#each group.entries as entry}
							<li class="h-feed">
								<a href={entry.url}>
									<div class="logo">
										{#if entry.image}
											{#if isSvg(entry.image)}
												<img src="/uses/{entry.image}" alt={entry.title} width="64px" />
											{:else}
												<enhanced:img
													src={getImage(entry.image)}
													sizes="(min-width:768px) 400px"
													alt={entry.title}
												/>
											{/if}
										{/if}
									</div>
									<div class="content">
										<div class="title">
											<strong>
												{entry.title}
											</strong>
										</div>
										<p>{entry.description}</p>
									</div>
									<Icon class="arrow" icon="ph:arrow-square-out-bold" />
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<div class="group archive">
				<h2>Archive</h2>
				<ul class="entries">
					{#each inactiveEntries as entry}
						<li class="h-feed">
							<a href={entry.url}>
								<div class="content">
									<div class="title">
										<strong>
											{entry.title}
										</strong>
									</div>
									<p>{entry.description}</p>
								</div>
								<Icon class="arrow" icon="ph:arrow-square-out-bold" />
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--xl);
		width: 90ch;
		margin: 0 auto;
		@media screen and (max-width: 62rem) {
			width: 100%;
		}
		.group {
			display: flex;
			flex-direction: column;
			gap: var(--m);
			> h2 {
				font-size: var(--font-l);
				line-height: 1.2;
				font-weight: 900;
				font-family: var(--font-family);
				letter-spacing: var(--font-letter-spacing-headline);
			}
			&.archive {
				.entries {
					grid-template-columns: repeat(3, minmax(0, 1fr));
					@media screen and (max-width: 62rem) {
						grid-template-columns: 1fr;
					}
					> li {
						> a {
							grid-template-columns: 1fr;
							grid-template-areas: 'content';
						}
					}
				}
			}
		}
	}
	.entries {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--l);
		width: 100%;
		@media screen and (max-width: 62rem) {
			grid-template-columns: 1fr;
		}
		> li {
			width: 100%;
			> a {
				height: 100%;
				display: grid;
				grid-template-rows: auto;
				grid-template-columns: 8rem 1fr;
				grid-template-areas: 'logo content';
				row-gap: var(--xl);
				transition: var(--transition);
				border-radius: var(--border-radius);
				background: var(--c-surface);
				color: var(--c-font);
				text-decoration: none;
				&:hover {
					transform: scale(0.97);
					cursor: pointer;
					:global(svg) {
						opacity: 1;
					}
				}
				.logo {
					grid-area: logo;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--c-font-accent-super-light);
					border-radius: var(--border-radius) 0 0 var(--border-radius);
					padding: 0 var(--l);
					img {
						width: 100%;
						height: 4rem;
						object-fit: contain;
					}
				}
				.content {
					grid-area: content;
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					align-content: stretch;
					justify-content: flex-start;
					align-items: stretch;
					gap: var(--xs);
					padding: var(--l);
					.title {
						strong {
							display: inline;
							font-weight: 900;
							font-size: var(--font-m);
							line-height: 1.2;
							font-family: var(--font-family);
							letter-spacing: var(--font-letter-spacing-headline);
						}
					}
					p {
						font-size: var(--font-m);
						line-height: 1.2;
					}
					.badge {
						position: absolute;
						top: 1rem;
						left: 2rem;
						display: inline;
						text-align: center;
						color: var(--c-font-accent-dark);
						font-weight: 600;
						font-size: var(--font-s);
						text-decoration: none;
						padding: 0 var(--xxs);
						border-radius: var(--border-radius);
						background: var(--c-surface-accent);
						border: var(--border);
						transition: transform var(--transition-time) var(--transition-ease);
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
	}
</style>
