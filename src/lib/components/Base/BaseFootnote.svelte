<script lang="ts">
	import BaseRichText from '$lib/components/Base/BaseRichText.svelte';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { children, class: className, id }: Props = $props();
</script>

<BaseRichText element="section" class={className ? `footnote ${className}` : 'footnote'} {id}>
	<p>
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
	</p>
</BaseRichText>

<style>
	.footnote {
		padding: var(--l);
		border-radius: var(--border-radius);
		background: var(--c-surface);
		color: var(--c-font);
		text-decoration: none;
		transition: var(--transition);
		overflow: hidden;
	}
</style>
