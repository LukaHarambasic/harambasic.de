<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const entry = data.entry;
</script>

{#if entry}
	<Entry {entry} />
{/if}

<style lang="postcss">
	article {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-content: stretch;
		justify-content: flex-start;
		align-items: stretch;
		gap: var(--l);
		@media screen and (max-width: 64rem) {
			flex-direction: column;
		}
		> picture {
			size: 20rem;
			@media screen and (max-width: 48rem) {
				width: 100%;
				height: auto;
			}
			img {
				width: inherit;
				height: inherit;
				border-radius: var(--border-radius);
				aspect-ratio: 1 / 1;
			}
		}
		> .content {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-content: flex-start;
			align-items: flex-start;
			h2 {
				font-weight: 900;
				font-size: var(--font-xl);
				line-height: 1.2;
				font-family: var(--font-family);
				letter-spacing: var(--font-letter-spacing-headline);
				margin: 0 0 0 0;
			}
			.tags {
				display: flex;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--xs);
				margin: 0 0 var(--m) 0;
			}
			.rich-text {
				margin: 0 0 var(--m) 0;
			}
			.links {
				flex-base: 100%;
				display: flex;
				flex-grow: 1;
				flex-direction: row;
				flex-wrap: wrap;
				align-content: stretch;
				justify-content: flex-start;
				align-items: flex-start;
				gap: var(--m);
			}
		}
	}
</style>
