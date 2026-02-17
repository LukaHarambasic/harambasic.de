<script lang="ts">
	import { resolvePath } from '$lib/util/paths';
	import Icon from '@iconify/svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import type { PageData } from './$types';
	import {
		getMergedFeedEntries,
		getLayoutOrderedEntries,
		getTargetVisibleCount,
		getInitialVisibleCount,
		type MergedFeedEntry
	} from '$lib/util/mergedFeed';
	import { getProjectImage, getUsesImage, getWorkImage } from '$lib/util/enhancedImages';
	import { isSvgImage } from '$lib/util/images';

	const SVG_PATH_PREFIX: Record<string, string> = {
		Projects: '/projects/',
		Uses: '/uses/',
		Work: '/work/'
	};

	function getSvgSrc(category: string, imageName: string): string {
		const prefix = SVG_PATH_PREFIX[category];
		return prefix ? `${prefix}${imageName}` : '';
	}

	function getEntryImage(entry: { category: string; image: string }) {
		switch (entry.category) {
			case 'Projects':
				return getProjectImage(entry.image);
			case 'Uses':
				return getUsesImage(entry.image);
			case 'Work':
				return getWorkImage(entry.image);
			default:
				return null;
		}
	}

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const INITIAL_TARGET = 6;

	let posts = $derived(data.posts[0] ?? []);
	let projects = $derived(data.projects[0] ?? []);
	let uses = $derived(data.uses[0] ?? []);
	let work = $derived(data.work?.[0] ?? []);

	let mergedEntries = $derived(getMergedFeedEntries(posts, projects, uses, work));
	let layoutOrdered = $derived(getLayoutOrderedEntries(mergedEntries));
	let initialCount = $derived(getInitialVisibleCount(layoutOrdered, INITIAL_TARGET));

	let visibleCount = $state<number | null>(null);
	let effectiveVisibleCount = $derived(visibleCount ?? initialCount);
	let visibleEntries = $derived(layoutOrdered.slice(0, effectiveVisibleCount));

	let feedRows = $derived.by(() => {
		const entries = visibleEntries;
		const rows: MergedFeedEntry[][] = [];
		let i = 0;
		while (i < entries.length) {
			const entry = entries[i];
			const nextEntry = entries[i + 1];
			if (entry === undefined) {
				i++;
				continue;
			}
			const isHalf = entry.category === 'Uses';
			if (isHalf && nextEntry !== undefined && nextEntry.category === 'Uses') {
				rows.push([entry, nextEntry]);
				i += 2;
			} else {
				rows.push([entry]);
				i += 1;
			}
		}
		return rows;
	});

	function showMore() {
		visibleCount = getTargetVisibleCount(layoutOrdered, effectiveVisibleCount, 6);
	}

	function collapse() {
		visibleCount = null;
	}
</script>

<section class="heyho">
	<div class="inner">
		<enhanced:img
			src="../../assets/img/profile.jpeg?w=1280;640;400"
			sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
			alt="Profile of Luka Harambasic"
			class="profile"
		/>
		<div class="content">
			<BaseRichText>
				<h1>Heyho, I'm Luka!</h1>
				<p>
					I'm a German/Croatian, based in the beautiful Copenhagen (Denmark). Right now, I'm
					building with the PLG squad at <a href="https://www.electricitymaps.com/"
						>Electricity Maps</a
					>. Feel free to explore my past
					<a href={resolvePath('/projects')}>projects</a>
					or check out my <a href="https://www.linkedin.com/in/harambasic/">LinkedIn profile</a>.
					I'm right now incredibly hyped about automation and AI. Whether you want to geek out over
					that or start a conversation about handball, woodworking, cooking, and sustainability,
					feel free to <a href="#contact">say hi</a>.
				</p>
			</BaseRichText>
		</div>
	</div>
</section>
<section class="featured">
	<h2>Explore</h2>
	<div class="feed">
		<table class="feed-table">
			<tbody>
				{#each feedRows as row (row.map((e) => e.slug).join(','))}
					<tr>
						{#each row as entry (entry.slug)}
							<td colspan={row.length === 1 ? 2 : 1}>
								<a
									href={entry.href.startsWith('http') ? entry.href : resolvePath(entry.href)}
									rel={entry.href.startsWith('http') ? 'external' : undefined}
									class="link"
									aria-label="View {entry.title}"
								>
									<div class="thumb">
										<div class="inner">
											{#if entry.category === 'Posts'}
												<Icon icon="ph:file-text-duotone" class="thumb-icon" />
											{:else if entry.image && isSvgImage(entry.image)}
												<img src={getSvgSrc(entry.category, entry.image)} alt={entry.title} />
											{:else if entry.image}
												{@const imageData = getEntryImage(entry)}
												{#if imageData}
													<enhanced:img
														src={imageData}
														sizes="(min-width:768px) 64px, 48px"
														alt={entry.title}
													/>
												{:else}
													<Icon icon="ph:empty-duotone" class="thumb-icon" />
												{/if}
											{:else}
												<Icon icon="ph:empty-duotone" class="thumb-icon" />
											{/if}
										</div>
									</div>
									<div class="content">
										<span class="label">{entry.category}</span>
										<strong class="title">{entry.title}</strong>
										{#if entry.updated?.display}
											<time class="date" datetime={entry.updated?.raw?.toString()}>
												{entry.updated.display}
											</time>
										{/if}
										{#if entry.description}
											<p class="description">{entry.description}</p>
										{/if}
									</div>
									<div class="external-link">
										<Icon
											icon={entry.isExternal
												? 'ph:arrow-square-out-bold'
												: 'ph:arrow-up-right-bold'}
										/>
									</div>
								</a>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="actions">
			{#if effectiveVisibleCount < layoutOrdered.length}
				<button type="button" class="btn" onclick={showMore}>Show more</button>
			{/if}
			{#if visibleCount !== null}
				<button type="button" class="btn" onclick={collapse}>Show less</button>
			{/if}
		</div>
	</div>
</section>

<style lang="postcss">
	.heyho {
		display: flex;
		position: relative;
		margin: var(--xl) 0;
		width: var(--layout-l);
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--l);
		@media screen and (width <= 56rem) {
			width: 100%;
		}
		.inner {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: stretch;
			gap: var(--l);
			@media screen and (width <= 44rem) {
				flex-direction: column;
			}
			.profile {
				size: 14.5rem;
				border-radius: var(--border-radius);
				@media screen and (width <= 32rem) {
					width: 100%;
					height: auto;
				}
			}
			.content {
				h1 {
					margin: 0 0 0.5rem;
					font-family: var(--font-family);
					font-size: var(--font-l);
					font-weight: 900;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				p {
					font-weight: normal;
					line-height: 1.5;
					a {
						line-break: loose;
					}
				}
			}
		}
	}
	.featured {
		--feed-border: color-mix(in srgb, var(--c-border) 80%, var(--c-font-accent-super-light));

		display: flex;
		width: 100%;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--l);

		h2 {
			margin: var(--xl) 0 var(--m) 0;
			font-family: var(--font-family);
			font-size: var(--font-xl);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
			text-align: center;
		}

		.feed {
			display: flex;
			width: 100%;
			flex-direction: column;
			gap: var(--m);
		}

		.feed-table {
			width: 100%;
			table-layout: fixed;
			border-collapse: collapse;
			@media screen and (width <= 68.75rem) {
				display: block;
			}
			tbody {
				@media screen and (width <= 68.75rem) {
					display: block;
				}
				tr {
					@media screen and (width <= 68.75rem) {
						display: block;
					}
					&:last-child {
						td {
							border-bottom: none;
						}
					}
					td {
						border-bottom: 1px solid var(--feed-border);
						vertical-align: top;
						@media screen and (width > 68.75rem) {
							&:first-child:not(:only-child) {
								border-right: 1px solid var(--feed-border);
							}
						}
						@media screen and (width <= 68.75rem) {
							display: block;
							width: 100%;
						}
						.link {
							display: flex;
							position: relative;
							padding: var(--l);
							width: 100%;
							min-width: 0;
							min-height: 0;
							flex: 1;
							flex-direction: row;
							align-items: flex-start;
							gap: var(--m);
							color: inherit;
							text-decoration: none;
							transition: background var(--transition);
							box-sizing: border-box;
							@media screen and (width <= 42rem) {
								flex-direction: column;
							}
							&:hover {
								background: color-mix(in srgb, var(--c-surface-accent) 40%, transparent);
								.external-link {
									color: var(--c-font);
								}
							}
						}
						.thumb {
							display: flex;
							width: 3rem;
							flex-shrink: 0;
							flex-direction: row;
							justify-content: center;
							align-items: flex-start;
						}
						.thumb .inner {
							display: flex;
							width: 3rem;
							min-height: 3rem;
							border-radius: var(--border-radius-small);
							flex-shrink: 0;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							overflow: hidden;
						}
						.thumb .inner img,
						.thumb .inner :global(enhanced-img) {
							display: block;
							width: 100%;
							height: auto;
							vertical-align: top;
						}
						.thumb .inner :global(.thumb-icon) {
							display: flex;
							width: 100%;
							height: 100%;
							min-height: 3rem;
							flex-shrink: 0;
							justify-content: center;
							align-items: center;
							color: var(--c-font-accent-dark);
						}
						.thumb .inner :global(.thumb-icon svg) {
							width: 1.5rem;
							height: 1.5rem;
						}
						.content {
							display: flex;
							min-width: 0;
							flex: 1;
							flex-direction: column;
							gap: var(--xs);
						}
						.label {
							color: var(--c-font-accent-dark);
							font-size: var(--font-s);
							font-weight: 600;
							letter-spacing: 0.05em;
							text-transform: uppercase;
						}
						.title {
							display: block;
							font-family: var(--font-family);
							font-size: var(--font-m);
							font-weight: 900;
							line-height: 1.2;
							letter-spacing: var(--font-letter-spacing-headline);
						}
						.date {
							color: var(--c-font-accent-dark);
							font-size: var(--font-s);
							font-weight: 400;
							font-style: italic;
						}
						.description {
							margin: 0;
							color: var(--c-font-accent-dark);
							font-size: var(--font-m);
							line-height: 1.5;
						}
						.external-link {
							display: flex;
							position: absolute;
							top: var(--l);
							right: var(--l);
							z-index: 10;
							width: 1.5rem;
							height: 1.5rem;
							flex-shrink: 0;
							justify-content: center;
							align-items: center;
							color: var(--c-font-accent-super-light);
							transition: var(--transition);
							pointer-events: none;
						}
						.external-link :global(svg) {
							width: 1rem;
							height: 1rem;
						}
					}
				}
			}
		}

		.actions {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: var(--m);
		}

		.btn {
			padding: var(--s) var(--m);
			border: 1px solid var(--c-border);
			border-radius: var(--border-radius);
			background: color-mix(in srgb, var(--c-surface-accent) 60%, transparent);
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-s);
			font-weight: 600;
			transition: var(--transition);
			cursor: pointer;
		}

		.btn:hover {
			background: color-mix(in srgb, var(--c-surface-accent) 80%, transparent);
		}
	}
</style>
