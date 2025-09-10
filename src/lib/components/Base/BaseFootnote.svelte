<script lang="ts">
	import type { BaseComponentProps } from '$lib/types/component';
	import { hasSnippet } from '$lib/util/snippet';

	let { children, class: className, id }: BaseComponentProps = $props();
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
