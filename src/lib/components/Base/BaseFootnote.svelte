<script lang="ts">
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { children, class: className, id }: Props = $props();
</script>

<section class="footnote rich-text" class:className {id}>
	<p>
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
	</p>
</section>

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
