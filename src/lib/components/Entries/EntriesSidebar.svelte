<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let detailsElement: HTMLDetailsElement;
	let summaryElement: HTMLElement;
	let isOpen: boolean;

	function handleToggle() {
		isOpen = detailsElement.open;
	}

	let isDesktop: boolean;

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

<aside>
	<details open={isDesktop} bind:this={detailsElement} on:toggle={handleToggle}>
		<summary class="card hoverable" bind:this={summaryElement}>
			<span>Filter & Sort</span>
			{#if isOpen}
				<Icon icon="ph:x-circle-bold" />
			{:else}
				<Icon icon="ph:funnel-simple-bold" />
			{/if}
		</summary>
		<div class="content">
			<slot />
		</div>
	</details>
</aside>

<style lang="postcss">
	aside {
		position: sticky;
		top: var(--l);
		@media screen and (max-width: 50rem) {
			position: static;
		}
		details {
			summary {
				display: none;
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-content: center;
				align-items: center;
				margin: 0 0 var(--l) 0;
				border-radius: var(--border-radius);
				background: var(--c-font);
				color: var(--c-light);
				padding: var(--m);
				border: var(--border);
				transition: var(--transition);
				&:hover {
					cursor: pointer;
					background: var(--c-surface-accent);
					color: var(--c-font);
				}
				&::-webkit-details-marker {
					display: none;
				}
				@media screen and (max-width: 50rem) {
					display: flex;
				}
				span {
					font-weight: 900;
					font-size: var(--font-m);
					line-height: 1.2;
					font-family: var(--font-family);
					letter-spacing: var(--font-letter-spacing-headline);
				}
				:global(.icon) {
					size: 1rem;
				}
			}
		}
		.content {
			display: flex !important;
			flex-direction: column;
			flex-wrap: nowrap;
			align-content: stretch;
			justify-content: flex-start;
			align-items: stretch;
			gap: var(--l);
			width: 100%;
		}
	}
</style>
