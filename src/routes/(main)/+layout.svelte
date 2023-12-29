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

	$: ({ title, subtitle, description, published, relativePath, permalink } = $page.data);

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
	<main id="main">
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
		<slot />
	</main>
	<LayoutFooter />
</div>

<style lang="postcss">
	.container {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-columns: 1fr var(--layout-xl) 1fr;
		grid-template-areas: '. header .' '. main .' '. footer .';
		row-gap: var(--xl);
		padding: var(--xl) 0;
		width: 100vw;
		height: auto;
		min-height: 100vh;
		@media screen and (max-width: 86rem) {
			grid-template-columns: 4rem minmax(0, 1fr) 4rem;
		}
		@media screen and (max-width: 32rem) {
			row-gap: var(-l);
			padding: var(--l) 0;
			grid-template-columns: 2rem minmax(0, 1fr) 2rem;
		}
		:global(> header) {
			grid-area: header;
		}
		> main {
			display: flex;
			grid-area: main;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: center;
			gap: var(--xl);
			.header {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-content: stretch;
				align-items: center;
				gap: var(--s);
				h1 {
					width: 30ch;
					font-weight: 900;
					font-size: var(--font-xl);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
					text-align: center;
					@media screen and (max-width: 42rem) {
						width: 100%;
					}
				}
				.subtitle {
					color: var(--c-font-accent-dark);
					font-size: var(--font-m);
					font-weight: normal;
					text-align: center;
					font-style: italic;
					margin: calc(-1 * var(--xs)) 0 0 0;
				}
				.date {
					a {
						color: var(--c-font);
						font-weight: 400;
						font-size: var(--font-m);
						text-decoration: none;
						font-style: italic;
					}
				}
			}
		}
		:global(> footer) {
			grid-area: footer;
		}
	}
</style>
