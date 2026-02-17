<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolvePath } from '$lib/util/paths';
	import { page } from '$app/stores';
	import '$lib/styles/reset.css';
	import '$lib/styles/fonts.css';
	import '$lib/styles/variables.css';
	import '$lib/styles/base.css';
	import '$lib/styles/highlight.css';
	import ContactModal from '$lib/components/Contact/ContactModal.svelte';
	import Hero from '$lib/components/Hero/Hero.svelte';
	import LayoutFooter from '$lib/components/Layout/LayoutFooter.svelte';
	import LayoutHeader from '$lib/components/Layout/LayoutHeader.svelte';
	import LayoutHead from '$lib/components/Layout/LayoutHead.svelte';
	import LayoutSkipToContent from '$lib/components/Layout/LayoutSkipToContent.svelte';
	import { hasSnippet } from '$lib/util/snippet';

	function clearHash() {
		goto(resolvePath($page.url.pathname), { replaceState: true, noScroll: true });
	}

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { children }: Props = $props();

	let { title, description, permalink } = $derived($page.data);
	const listPaths = ['/work', '/posts', '/projects', '/uses'] as const;
	let isListPage = $derived(listPaths.includes($page.url.pathname as (typeof listPaths)[number]));
	let showHero = $derived(isListPage && $page.url.pathname !== '/feeds');
	let isDetailPage = $derived.by(() => {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		return (
			segments.length === 2 &&
			(segments[0] === 'work' || segments[0] === 'posts' || segments[0] === 'projects')
		);
	});

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
		{#if showHero}
			<Hero title={$page.data.title ?? ''} description={$page.data.description ?? ''} />
		{/if}
		{#if hasSnippet(children)}
			{#if isDetailPage}
				<div class="golden-ratio">{@render children()}</div>
			{:else}
				{@render children()}
			{/if}
		{/if}
	</main>
	<LayoutFooter />
</div>
{#if $page.url.hash === '#contact'}
	<ContactModal onClose={clearHash} />
{/if}

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
			row-gap: var(--l);
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
			.golden-ratio {
				margin: 0 auto;
				width: 100%;
				max-width: calc(var(--layout-xl) * 0.618);
				@media screen and (width <= 48rem) {
					width: 100%;
				}
			}
		}
		:global(> footer) {
			grid-area: footer;
		}
	}
</style>
