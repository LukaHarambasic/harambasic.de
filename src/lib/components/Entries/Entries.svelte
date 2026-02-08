<script lang="ts">
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		entries?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		sidebar?: import('svelte').Snippet;
		class?: string;
	}

	let { entries, sidebar, children, class: className }: Props = $props();

	let hasSidebar = $derived(hasSnippet(sidebar));
</script>

<section class:no-sidebar={!hasSidebar} class:className>
	<div class="entries">
		{#if hasSnippet(entries)}
			{@render entries()}
		{:else if hasSnippet(children)}
			{@render children()}
		{/if}
	</div>
	<div class="sidebar">
		{#if hasSnippet(sidebar)}
			{@render sidebar()}
		{/if}
	</div>
</section>

<style lang="postcss">
	section {
		display: grid;
		width: 100%;
		row-gap: var(--l);
		column-gap: var(--l);
		grid-template-rows: auto auto;
		grid-template-columns: 70ch 1fr;
		&.no-sidebar {
			width: 100%;
			grid-template-columns: 1fr;
			.entries {
				grid-column: 1 / -1;
			}
		}
		@media screen and (width <= 74rem) {
			grid-template-columns: 1fr 18rem;
		}
		@media screen and (width <= 50rem) {
			grid-template-columns: 1fr;
		}
		.entries {
			width: 100%;
			@media screen and (width <= 50rem) {
				order: 1;
				grid-template-columns: 1fr;
			}
		}
		.sidebar {
			@media screen and (width <= 50rem) {
				order: 0;
				grid-template-columns: 1fr;
			}
		}
	}
</style>
