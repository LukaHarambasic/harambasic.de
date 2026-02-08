<script lang="ts">
	import Entries from '$lib/components/Entries/Entries.svelte';
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { isExternalUrl, sortDate } from '$lib/util/helper';
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
	let usesEntries = $derived(data.uses[0]);
	let tags = $derived(data.uses[1]);
	interface GroupedEntries {
		title: string;
		entries: typeof usesEntries;
	}

	const groupedEntriesOrder = ['Essentials', 'Hardware', 'Software', 'Development'];

	let activeEntries = $derived(usesEntries.filter((entry) => entry.status === 'active'));
	let inactiveEntries = $derived(usesEntries.filter((entry) => entry.status === 'inactive'));

	let activeGroupedEntries: GroupedEntries[] = $derived(
		tags
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
			})
	);
</script>

<Entries>
	{#snippet entries()}
		<div class="wrapper">
			{#each activeGroupedEntries as group}
				<div class="group">
					<h2>{group.title}</h2>
					<ul class="entries">
						{#each group.entries as entry}
							<li class="h-feed">
								<BaseCard element="a" href={entry.url} variant="default" class="withImageSpan">
									{#if entry.image}
										<div class="thumb">
											<div class="inner">
												{#if isSvgImage(entry.image)}
													<img src="/uses/{entry.image}" alt={entry.title} />
												{:else}
													{@const imageData = getImage(entry.image)}
													{#if imageData}
														<enhanced:img
															src={imageData}
															sizes="(min-width:768px) 64px, 48px"
															alt={entry.title}
														/>
													{/if}
												{/if}
											</div>
										</div>
									{/if}
									<div class="content">
										<div class="header">
											<div class="info">
												<h2 class="name">{entry.title}</h2>
											</div>
											<div class="external-link">
												<Icon
													icon={isExternalUrl(entry.url)
														? 'ph:arrow-square-out-bold'
														: 'ph:arrow-up-right-bold'}
												/>
											</div>
										</div>
										<div class="description">
											<p>{entry.description}</p>
										</div>
									</div>
								</BaseCard>
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
							<BaseCard element="a" href={entry.url} variant="default" class="contentOnly">
								<div class="content">
									<div class="title">
										<strong>
											{entry.title}
										</strong>
									</div>
									<p>{entry.description}</p>
								</div>
								<div class="external-link">
									<Icon
										icon={isExternalUrl(entry.url)
											? 'ph:arrow-square-out-bold'
											: 'ph:arrow-up-right-bold'}
									/>
								</div>
							</BaseCard>
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
			&.archive .entries {
				grid-template-columns: repeat(3, minmax(0, 1fr));
				@media screen and (width <= 62rem) {
					grid-template-columns: 1fr;
				}
			}
		}

		/* contentOnly (archive) — usage-specific, moved from BaseCard */
		:global(.base-card.contentOnly) {
			display: flex;
			position: relative;
			padding: var(--m);
			flex-direction: column;
			grid-template-areas: unset;
			grid-template-columns: unset;
		}
		:global(.base-card.contentOnly .content) {
			display: flex;
			padding: 0;
			padding-right: calc(1.5rem + var(--xs));
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			gap: var(--xs);
		}
		:global(.base-card.contentOnly .external-link) {
			position: absolute;
			top: var(--m);
			right: var(--m);
		}
		:global(.base-card.contentOnly .content .title strong) {
			display: inline;
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		:global(.base-card.contentOnly .content p) {
			font-size: var(--font-m);
			line-height: 1.2;
		}

		/* withImageSpan (main list) — usage-specific, moved from BaseCard */
		:global(.base-card.withImageSpan) {
			display: flex;
			position: relative;
			padding: var(--l);
			flex-direction: row;
			align-items: flex-start;
			gap: var(--m);
			@media screen and (width <= 42rem) {
				flex-direction: column;
			}
		}
		:global(.base-card.withImageSpan[href] .external-link) {
			position: absolute;
			top: var(--l);
			right: var(--l);
			z-index: 10;
		}
		:global(.base-card.withImageSpan .thumb) {
			display: flex;
			width: 3rem;
			flex-shrink: 0;
			flex-direction: row;
			justify-content: center;
			align-items: flex-start;
		}
		:global(.base-card.withImageSpan .inner) {
			display: block;
			width: 3rem;
			border-radius: var(--border-radius-small);
			flex-shrink: 0;
			overflow: hidden;
		}
		:global(.base-card.withImageSpan .inner img),
		:global(.base-card.withImageSpan .inner enhanced-img) {
			display: block;
			width: 100%;
			height: auto;
			vertical-align: top;
		}
		:global(.base-card.withImageSpan .content) {
			display: flex;
			min-width: 0;
			flex: 1;
			flex-direction: column;
			gap: 0;
		}
		:global(.base-card.withImageSpan .header) {
			display: flex;
			margin: 0;
			margin-bottom: var(--m);
			padding-right: calc(1.5rem + var(--xs));
			justify-content: flex-start;
			align-items: flex-start;
			gap: var(--m);
		}
		:global(.base-card.withImageSpan .info) {
			display: flex;
			min-width: 0;
			flex: 1;
			flex-direction: column;
			gap: 0;
		}
		:global(.base-card.withImageSpan .name) {
			margin: 0;
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-xl);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		:global(.base-card.withImageSpan .description) {
			margin: 0;
		}
		:global(.base-card.withImageSpan .description p) {
			margin: 0;
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 400;
			line-height: 1.5;
		}
		.entries {
			display: grid;
			width: 100%;
			align-items: stretch;
			gap: var(--l);
			grid-template-columns: repeat(2, minmax(0, 1fr));
			@media screen and (width <= 62rem) {
				grid-template-columns: 1fr;
			}
			> li {
				display: flex;
				width: 100%;
				min-height: 0;
			}
			> li :global(.base-card) {
				min-width: 0;
				min-height: 0;
				flex: 1;
			}
		}
	}
</style>
