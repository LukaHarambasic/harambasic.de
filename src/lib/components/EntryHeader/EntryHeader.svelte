<script lang="ts">
	import { hasSnippet } from '$lib/util/snippet';

	type Snippet = import('svelte').Snippet;

	interface Props {
		title: string;
		leading?: Snippet;
		meta?: string | Snippet;
	}

	let { title, leading, meta }: Props = $props();

	const hasLeading = $derived(hasSnippet(leading));
	const hasMeta = $derived(meta !== undefined && meta !== null);
	const metaIsString = $derived(typeof meta === 'string');
	const metaIsSnippet = $derived(hasMeta && !metaIsString && hasSnippet(meta as Snippet));
</script>

<header class="entry-header">
	{#if hasLeading}
		<div class="leading">
			{@render leading!()}
		</div>
	{/if}
	<h1 class="title">{title}</h1>
	{#if hasMeta}
		<div class="meta">
			{#if metaIsString}
				{meta}
			{:else if metaIsSnippet}
				{@render (meta as Snippet)()}
			{/if}
		</div>
	{/if}
</header>

<style lang="postcss">
	.entry-header {
		display: flex;
		margin-bottom: var(--m);
		flex-direction: column;
		align-items: flex-start;
		gap: var(--m);
		.leading {
			display: flex;
			flex-shrink: 0;
			justify-content: flex-start;
			align-items: center;
		}
		.title {
			margin: 0;
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-xl);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		.meta {
			color: var(--c-font-accent-dark);
			font-family: var(--font-family);
			font-size: var(--font-s);
			font-weight: 400;
			font-style: italic;
			line-height: 1.5;
		}
	}
</style>
