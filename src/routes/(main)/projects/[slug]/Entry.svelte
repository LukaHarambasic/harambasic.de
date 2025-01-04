<script lang="ts">
	import type { Project } from '$lib/types/project';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	const pictures = import.meta.glob(
		'../../../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	const getImage = (name: string) => {
		const image = pictures[`../../../../assets/img/projects/${name}`];
		if (!image) {
			return {};
		}
		return image.default;
	};

	interface Props {
		entry: Project;
	}

	let { entry }: Props = $props();
</script>

<article class="h-entry">
	<enhanced:img
		src={getImage(entry.image)}
		sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
		alt={entry.title}
	/>
	<div class="content">
		<div class="rich-text">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html entry.html}
		</div>
		<ul class="tags">
			{#each entry.tags as tag}
				<li>
					<BaseTag {tag} />
				</li>
			{/each}
		</ul>
		<ul class="links rich-text">
			{#each entry.links as link}
				<li>
					<a href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</a>
				</li>
			{/each}
		</ul>
	</div>
</article>

<style lang="postcss">
	article {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		width: 90ch;
		@media screen and (max-width: 64rem) {
			width: 100%;
		}
		@media screen and (max-width: 48rem) {
			flex-direction: column;
		}
		> picture {
			size: 20rem;
			@media screen and (max-width: 64rem) {
				size: 15rem;
			}
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
