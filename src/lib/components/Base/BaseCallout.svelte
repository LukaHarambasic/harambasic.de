<script lang="ts">
	import BaseCard from '$lib/components/Base/BaseCard.svelte';
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		prefix: string;
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { prefix, children, class: className, id }: Props = $props();
</script>

<BaseCard class={className ? `callout ${className}` : 'callout'} {id}>
	{#if prefix}
		<strong>{prefix}</strong>
	{/if}
	<BaseRichText class="content">
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
	</BaseRichText>
</BaseCard>

<style lang="postcss">
	:global(.callout) {
		display: flex;
		strong {
			display: inline-block;
			padding: var(--s) var(--m);
			border: var(--border);
			border-radius: var(--border-radius-small);
			background: var(--c-surface-accent);
			flex: 1 0 auto;
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 900;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		.content {
			flex: 0 1 auto;
		}
	}
</style>
