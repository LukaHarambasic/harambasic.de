<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		id?: string;
	}

	let { children, class: className, id }: Props = $props();

	let detailsElement: HTMLDetailsElement | undefined = $state();
	let summaryElement: HTMLElement | undefined = $state();
	let isOpen: boolean | undefined = $state();

	function handleToggle() {
		if (detailsElement) {
			isOpen = detailsElement.open;
		}
	}

	let isDesktop: boolean | undefined = $state();

	function handleSummaryVisibility() {
		if (!summaryElement) return;
		const style = window.getComputedStyle(summaryElement);
		isDesktop = style.display === 'none';
	}

	onMount(() => {
		handleSummaryVisibility();
		window.addEventListener('resize', () => {
			handleSummaryVisibility();
		});
	});
</script>

<aside class:className {id}>
	<details open={isDesktop} bind:this={detailsElement} ontoggle={handleToggle}>
		<summary class="hoverable" bind:this={summaryElement}>
			<span>Filter & Sort</span>
			{#if isOpen}
				<Icon icon="ph:x-circle-bold" />
			{:else}
				<Icon icon="ph:funnel-simple-bold" />
			{/if}
		</summary>
		<div class="content">
			{#if hasSnippet(children)}
				{@render children()}
			{/if}
		</div>
	</details>
</aside>

<style lang="postcss">
	aside {
		position: sticky;
		top: var(--l);
		@media screen and (width <= 50rem) {
			position: static;
		}
		details {
			summary {
				display: none;
				margin: 0 0 var(--l) 0;
				padding: var(--l);
				border: var(--border);
				border-radius: var(--border-radius);
				background: var(--c-surface);
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: center;
				align-content: center;
				gap: var(--m);
				color: var(--c-light);
				transition: var(--transition);
				&:hover {
					background: var(--c-surface-accent);
					color: var(--c-font);
					cursor: pointer;
				}
				&::-webkit-details-marker {
					display: none;
				}
				@media screen and (width <= 42rem) {
					flex-direction: column;
				}
				@media screen and (width <= 50rem) {
					display: flex;
					padding: var(--m);
					background: var(--c-font);
				}
				span {
					font-family: var(--font-family);
					font-size: var(--font-m);
					font-weight: 900;
					line-height: 1.2;
					letter-spacing: var(--font-letter-spacing-headline);
				}
				:global(.icon) {
					size: 1rem;
				}
			}
		}
		.content {
			display: flex !important;
			width: 100%;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			gap: var(--l);
		}
	}
</style>
