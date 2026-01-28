<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/styles/reset.css';
	import '$lib/styles/fonts.css';
	import '$lib/styles/variables.css';
	import '$lib/styles/base.css';
	import '$lib/styles/global.css';
	import '$lib/styles/highlight.css';
	import LayoutFooter from '$lib/components/Layout/LayoutFooter.svelte';
	import LayoutHeader from '$lib/components/Layout/LayoutHeader.svelte';
	import LayoutHead from '$lib/components/Layout/LayoutHead.svelte';
	import LayoutSkipToContent from '$lib/components/Layout/LayoutSkipToContent.svelte';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { children }: Props = $props();

	let { title, subtitle, description, published, relativePath, permalink } = $derived($page.data);
	let isWorkDetailPage = $derived($page.url.pathname.startsWith('/work/') && $page.url.pathname !== '/work');

	// needs to be here until the following issue in vite is resolved and included in an sveltekit release
	// https://github.com/sveltejs/kit/issues/5240
	// import.meta.glob(
	//   [
	//     '../lib/images/**/**/*.png',
	//     '../lib/images/**/**/*.svg',
	//     '../lib/images/**/**/*.jpg',
	//     '../lib/images/**/**/*.gif',
	//     '../lib/images/**/**/*.mp3'
	//   ],
	//   { eager: true }
	// )
</script>

<LayoutHead {title} {description} {permalink} />
<LayoutSkipToContent />
<div class="container">
	<LayoutHeader />
	<main id="main" class:work-detail={isWorkDetailPage}>
		{#if title}
			<section class="header">
				<h1>{title}</h1>
				{#if subtitle}
					<strong class="subtitle">{subtitle}</strong>
				{/if}
				{#if published && relativePath}
					<time class="date dt-published" datetime={published?.raw?.toString()}>
						<a href={relativePath} class="u-url">{published.display}</a>
					</time>
				{/if}
			</section>
		{/if}
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
	</main>
	<LayoutFooter />
</div>

<style lang="postcss">
	.container {
		display: grid;
		padding: var(--xl) 0;
		width: 100%;
		height: auto;
		min-height: 100vh;
		row-gap: var(--xl);
		grid-template-areas: '. header .' '. main .' '. footer .';
		grid-template-rows: auto 1fr auto;
		grid-template-columns: 1fr var(--layout-xl) 1fr;
		@media screen and (width <= 86rem) {
			grid-template-columns: 4rem minmax(0, 1fr) 4rem;
		}
		@media screen and (width <= 32rem) {
			padding: var(--l) 0;
			row-gap: var(-l);
			grid-template-columns: 2rem minmax(0, 1fr) 2rem;
		}
		:global(> header) {
			grid-area: header;
		}
		> main {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: center;
			align-content: stretch;
			gap: var(--xl);
			grid-area: main;
			&.work-detail {
				.header {
					position: absolute;
					margin: -1px;
					padding: 0;
					width: 1px;
					height: 1px;
					border-width: 0;
					white-space: nowrap;
					overflow: hidden;
					clip: rect(0, 0, 0, 0);
				}
			}
			.header {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: center;
				align-content: stretch;
				gap: var(--s);
				h1 {
					width: 30ch;
					font-family: var(--font-family);
					font-size: var(--font-xl);
					font-weight: 900;
					line-height: 1.2;
					letter-spacing: var(--font-letter-spacing-headline);
					text-align: center;
					@media screen and (width <= 42rem) {
						width: 100%;
					}
				}
				.subtitle {
					margin: calc(-1 * var(--xs)) 0 0;
					color: var(--c-font-accent-dark);
					font-size: var(--font-m);
					font-weight: normal;
					font-style: italic;
					text-align: center;
				}
				.date {
					a {
						color: var(--c-font);
						font-size: var(--font-m);
						font-weight: 400;
						font-style: italic;
						text-decoration: none;
					}
				}
			}
		}
		:global(> footer) {
			grid-area: footer;
		}
	}
</style>
