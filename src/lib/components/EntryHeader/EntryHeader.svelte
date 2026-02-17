<script lang="ts">
	import { hasSnippet } from '$lib/util/snippet';

	type Snippet = import('svelte').Snippet;

	interface Props {
		title: string;
		leading?: Snippet;
		meta?: string | Snippet;
		leadingPosition?: 'block' | 'inline';
	}

	let { title, leading, meta, leadingPosition = 'block' }: Props = $props();

	const hasLeading = $derived(hasSnippet(leading));
	const hasMeta = $derived(meta !== undefined && meta !== null);
	const metaIsString = $derived(typeof meta === 'string');
	const metaIsSnippet = $derived(hasMeta && !metaIsString && hasSnippet(meta as Snippet));
</script>

<header class="entry-header" class:inline={leadingPosition === 'inline'}>
	{#if leadingPosition === 'inline'}
		{#if hasLeading && leading}
			<div class="leading">
				{@render leading()}
			</div>
		{/if}
		<div class="title-meta">
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
		</div>
	{:else}
		{#if hasLeading && leading}
			<div class="leading">
				{@render leading()}
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
	{/if}
</header>

<style lang="postcss">
	.entry-header {
		display: flex;
		margin-bottom: var(--m);
		flex-direction: column;
		align-items: flex-start;
		gap: var(--m);
		&.inline {
			flex-direction: row;
			align-items: flex-start;
			gap: var(--m);
			.title-meta {
				display: flex;
				min-width: 0;
				flex: 1;
				flex-direction: column;
				gap: var(--xs);
			}
		}
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
