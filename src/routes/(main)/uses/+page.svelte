<script lang="ts">
	import Entries from '$lib/components/Entries/Entries.svelte';
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
								<a href={entry.url} class="item">
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
							<a href={entry.url} class="archive-item">
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
		--uses-border: color-mix(
			in srgb,
			var(--c-surface-accent) 80%,
			var(--c-font-accent-super-light)
		);

		display: flex;
		margin: 0 auto;
		width: 90ch;
		flex-direction: column;
		gap: var(--xl);
		@media screen and (width <= 68.75rem) {
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
				@media screen and (width <= 68.75rem) {
					grid-template-columns: 1fr;
				}
			}
		}

		.item,
		.archive-item {
			display: flex;
			position: relative;
			padding: var(--l);
			width: 100%;
			min-width: 0;
			min-height: 0;
			flex: 1;
			color: inherit;
			text-decoration: none;
			transition: background var(--transition);
			box-sizing: border-box;
		}
		.item:hover,
		.archive-item:hover {
			background: color-mix(in srgb, var(--c-surface-accent) 40%, transparent);
		}
		.item:hover .external-link,
		.archive-item:hover .external-link {
			color: var(--c-font);
		}
		.item .external-link,
		.archive-item .external-link {
			display: flex;
			width: 1.5rem;
			height: 1.5rem;
			flex-shrink: 0;
			justify-content: center;
			align-items: center;
			color: var(--c-font-accent-super-light);
			transition: var(--transition);
			pointer-events: none;
		}
		.item .external-link :global(svg),
		.archive-item .external-link :global(svg) {
			width: 1rem;
			height: 1rem;
		}

		.item {
			flex-direction: row;
			align-items: flex-start;
			gap: var(--m);
			@media screen and (width <= 42rem) {
				flex-direction: column;
			}
			.external-link {
				position: absolute;
				top: var(--l);
				right: var(--l);
				z-index: 10;
			}
			.thumb {
				display: flex;
				width: 3rem;
				flex-shrink: 0;
				flex-direction: row;
				justify-content: center;
				align-items: flex-start;
			}
			.inner {
				display: block;
				width: 3rem;
				border-radius: var(--border-radius-small);
				flex-shrink: 0;
				overflow: hidden;
			}
			.inner img,
			.inner :global(enhanced-img) {
				display: block;
				width: 100%;
				height: auto;
				vertical-align: top;
			}
			.content {
				display: flex;
				min-width: 0;
				flex: 1;
				flex-direction: column;
				gap: 0;
			}
			.header {
				display: flex;
				margin: 0;
				margin-bottom: var(--m);
				padding-right: calc(1.5rem + var(--xs));
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--m);
			}
			.info {
				display: flex;
				min-width: 0;
				flex: 1;
				flex-direction: column;
				gap: 0;
			}
			.name {
				margin: 0;
				color: var(--c-font);
				font-family: var(--font-family);
				font-size: var(--font-xl);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			.description {
				margin: 0;
			}
			.description p {
				margin: 0;
				color: var(--c-font-accent-dark);
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 400;
				line-height: 1.5;
			}
		}

		.archive-item {
			padding: var(--m);
			flex-direction: column;
			.external-link {
				position: absolute;
				top: var(--m);
				right: var(--m);
			}
			.content {
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
			.content .title strong {
				display: inline;
				font-family: var(--font-family);
				font-size: var(--font-m);
				font-weight: 900;
				line-height: 1.2;
				letter-spacing: var(--font-letter-spacing-headline);
			}
			.content p {
				font-size: var(--font-m);
				line-height: 1.2;
			}
		}

		.entries {
			display: grid;
			width: 100%;
			align-items: stretch;
			gap: 0;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			@media screen and (width <= 68.75rem) {
				grid-template-columns: 1fr;
			}
			> li {
				display: flex;
				width: 100%;
				min-height: 0;
				border-bottom: 1px solid var(--uses-border);
			}
			> li:nth-last-child(-n + 2) {
				border-bottom: none;
			}

			/* Odd count: last row has 1 item; restore bottom border on 2nd-to-last */
			&:has(> :first-child:nth-last-child(odd)) > li:nth-last-child(2) {
				border-bottom: 1px solid var(--uses-border);
			}
			@media screen and (width > 68.75rem) {
				> li:nth-child(odd) .item,
				> li:nth-child(odd) .archive-item {
					border-right: 1px solid var(--uses-border);
				}
			}

			/* Outer corners: top row */
			> li:first-child .item,
			> li:first-child .archive-item {
				border-top-left-radius: var(--border-radius);
			}
			> li:nth-child(2) .item,
			> li:nth-child(2) .archive-item {
				border-top-right-radius: var(--border-radius);
			}

			/* Outer corners: last row (even count = 2 items) */
			&:has(> :first-child:nth-last-child(even)) > li:nth-last-child(2) .item,
			&:has(> :first-child:nth-last-child(even)) > li:nth-last-child(2) .archive-item {
				border-bottom-left-radius: var(--border-radius);
			}
			&:has(> :first-child:nth-last-child(even)) > li:last-child .item,
			&:has(> :first-child:nth-last-child(even)) > li:last-child .archive-item {
				border-bottom-right-radius: var(--border-radius);
			}

			/* Outer corners: last row (odd count = 1 item) */
			&:has(> :first-child:nth-last-child(odd)) > li:last-child .item,
			&:has(> :first-child:nth-last-child(odd)) > li:last-child .archive-item {
				border-bottom-left-radius: var(--border-radius);
			}

			@media screen and (width <= 68.75rem) {
				> li:nth-last-child(-n + 2) {
					border-bottom: 1px solid var(--uses-border);
				}
				> li:last-child {
					border-bottom: none;
				}

				/* 1 column: first item both top corners, last item both bottom corners */
				> li:first-child .item,
				> li:first-child .archive-item {
					border-top-right-radius: var(--border-radius);
				}
				> li:nth-child(2) .item,
				> li:nth-child(2) .archive-item {
					border-top-right-radius: 0;
				}
				&:has(> :first-child:nth-last-child(even)) > li:nth-last-child(2) .item,
				&:has(> :first-child:nth-last-child(even)) > li:nth-last-child(2) .archive-item {
					border-bottom-left-radius: 0;
				}
				&:has(> :first-child:nth-last-child(even)) > li:last-child .item,
				&:has(> :first-child:nth-last-child(even)) > li:last-child .archive-item {
					border-bottom-right-radius: var(--border-radius);
				}
				&:has(> :first-child:nth-last-child(odd)) > li:last-child .item,
				&:has(> :first-child:nth-last-child(odd)) > li:last-child .archive-item {
					border-bottom-left-radius: var(--border-radius);
				}

				/* 1 column: last item has both bottom corners */
				> li:last-child .item,
				> li:last-child .archive-item {
					border-bottom-left-radius: var(--border-radius);
					border-bottom-right-radius: var(--border-radius);
				}
			}
		}
		@media screen and (width > 68.75rem) {
			.group.archive .entries > li:nth-last-child(-n + 3) {
				border-bottom: none;
			}

			/* Odd count mod 3: restore bottom border so only last row is borderless */
			.group.archive .entries:has(> :first-child:nth-last-child(3n + 1)) > li:nth-last-child(2),
			.group.archive .entries:has(> :first-child:nth-last-child(3n + 1)) > li:nth-last-child(3) {
				border-bottom: 1px solid var(--uses-border);
			}
			.group.archive .entries:has(> :first-child:nth-last-child(3n + 2)) > li:nth-last-child(3) {
				border-bottom: 1px solid var(--uses-border);
			}
			.group.archive .entries > li:nth-child(3n + 1) .archive-item,
			.group.archive .entries > li:nth-child(3n + 2) .archive-item {
				border-right: 1px solid var(--uses-border);
			}
		}

		/* Archive: outer corners (3 columns) */
		.group.archive .entries > li:first-child .archive-item {
			border-top-left-radius: var(--border-radius);
		}
		.group.archive .entries > li:nth-child(3) .archive-item {
			border-top-right-radius: var(--border-radius);
		}
		.group.archive
			.entries:has(> :first-child:nth-last-child(3n))
			> li:nth-last-child(3)
			.archive-item {
			border-bottom-left-radius: var(--border-radius);
		}
		.group.archive .entries:has(> :first-child:nth-last-child(3n)) > li:last-child .archive-item {
			border-bottom-right-radius: var(--border-radius);
		}
		.group.archive
			.entries:has(> :first-child:nth-last-child(3n + 1))
			> li:last-child
			.archive-item {
			border-bottom-left-radius: var(--border-radius);
		}
		.group.archive
			.entries:has(> :first-child:nth-last-child(3n + 2))
			> li:nth-last-child(2)
			.archive-item {
			border-bottom-left-radius: var(--border-radius);
		}
		.group.archive
			.entries:has(> :first-child:nth-last-child(3n + 2))
			> li:last-child
			.archive-item {
			border-bottom-right-radius: var(--border-radius);
		}

		@media screen and (width <= 68.75rem) {
			.group.archive .entries > li:last-child {
				border-bottom: none;
			}

			/* Archive 1 column: first both top, last both bottom */
			.group.archive .entries > li:first-child .archive-item {
				border-top-right-radius: var(--border-radius);
			}
			.group.archive .entries > li:nth-child(3) .archive-item {
				border-top-right-radius: 0;
			}
			.group.archive .entries > li:last-child .archive-item {
				border-bottom-left-radius: var(--border-radius);
				border-bottom-right-radius: var(--border-radius);
			}
		}
	}
</style>
