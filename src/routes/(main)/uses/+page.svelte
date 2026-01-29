<script lang="ts">
	import Entries from '$lib/components/Entries/Entries.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { sortDate } from '$lib/util/helper';
	import { getImageFromGlob, isSvgImage, type ImageGlobResult } from '$lib/util/images';

	const pictures: ImageGlobResult = import.meta.glob(
		'../../../assets/img/uses/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const USES_IMAGE_PATH = '../../../assets/img/uses/';

	const getImage = (name: string) => getImageFromGlob(pictures, USES_IMAGE_PATH, name);

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

	const activeEntries = usesEntries.filter((entry) => entry.status === 'active');
	const inactiveEntries = usesEntries.filter((entry) => entry.status === 'inactive');

	const activeGroupedEntries: GroupedEntries[] = tags
		.map((tag) => ({
			title: tag.display,
			entries: activeEntries
				.filter((entry) => entry.tags.some((entryTag) => entryTag.slug === tag.slug))
				.sort((a, b) => sortDate(a.published.raw, b.published.raw))
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
											{#if isSvgImage(entry.image)}
												<img src="/uses/{entry.image}" alt={entry.title} width="64px" />
											{:else}
												{@const imageData = getImage(entry.image)}
												{#if imageData}
													<enhanced:img
														src={imageData}
														sizes="(min-width:768px) 400px"
														alt={entry.title}
													/>
												{/if}
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
		margin: 0 auto;
		width: 90ch;
		flex-direction: column;
		gap: var(--xl);
		@media screen and (width <= 62rem) {
			width: 100%;
		}
		.group {
			display: flex;
			flex-direction: column;
			gap: var(--m);
			> h2 {
				font-family: var(--font-family);
				font-size: var(--font-l);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			&.archive {
				.entries {
					grid-template-columns: repeat(3, minmax(0, 1fr));
					@media screen and (width <= 62rem) {
						grid-template-columns: 1fr;
					}
					> li {
						> a {
							grid-template-areas: 'content';
							grid-template-columns: 1fr;
						}
					}
				}
			}
		}
	}
	.entries {
		display: grid;
		width: 100%;
		gap: var(--l);
		grid-template-columns: repeat(2, minmax(0, 1fr));
		@media screen and (width <= 62rem) {
			grid-template-columns: 1fr;
		}
		> li {
			width: 100%;
			> a {
				display: grid;
				height: 100%;
				border-radius: var(--border-radius);
				background: var(--c-surface);
				row-gap: var(--xl);
				grid-template-areas: 'logo content';
				grid-template-rows: auto;
				grid-template-columns: 8rem 1fr;
				color: var(--c-font);
				text-decoration: none;
				transition: var(--transition);
				&:hover {
					transform: scale(0.97);
					cursor: pointer;
					:global(svg) {
						opacity: 1;
					}
				}
				.logo {
					display: flex;
					padding: 0 var(--l);
					border-radius: var(--border-radius) 0 0 var(--border-radius);
					background: var(--c-font-accent-super-light);
					justify-content: center;
					align-items: center;
					grid-area: logo;
					img {
						width: 100%;
						height: 4rem;
						object-fit: contain;
					}
				}
				.content {
					display: flex;
					padding: var(--l);
					flex-direction: column;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-items: stretch;
					align-content: stretch;
					gap: var(--xs);
					grid-area: content;
					.title {
						strong {
							display: inline;
							font-family: var(--font-family);
							font-size: var(--font-m);
							font-weight: 900;
							line-height: 1.2;
							letter-spacing: var(--font-letter-spacing-headline);
						}
					}
					p {
						font-size: var(--font-m);
						line-height: 1.2;
					}
				}
				:global(.arrow) {
					opacity: 0;
					position: absolute;
					top: var(--m);
					right: calc((-1) * var(--m));
					size: var(--l);
					border: 4px solid var(--c-light);
					border-radius: 100%;
					box-shadow:
						0 1px 2px rgba(0, 0, 0, 0.03),
						0 2px 4px rgba(0, 0, 0, 0.03),
						0 4px 8px rgba(0, 0, 0, 0.03),
						0 8px 16px rgba(0, 0, 0, 0.03),
						0 16px 32px rgba(0, 0, 0, 0.03),
						0 32px 64px rgba(0, 0, 0, 0.03);
					background: var(--c-light);
					color: var(--c-font-accent-dark);
					transition: var(--transition);
				}
			}
		}
	}
</style>
