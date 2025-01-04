<script lang="ts">
	interface Props {
		path?: string;
		entries?: import('svelte').Snippet;
		sidebar?: import('svelte').Snippet;
	}

	let { path = '', entries, sidebar }: Props = $props();

	let rssPath = $derived(`${path}/rss`);

	// Compute if sidebar is empty
	let hasSidebar = $derived(!!sidebar);
</script>

<section class:no-sidebar={!hasSidebar}>
	<div class="entries">
		{@render entries?.()}
	</div>
	<div class="sidebar">
		{@render sidebar?.()}
	</div>
	<div class="rss rich-text">
		<p>
			<a href={rssPath}>RSS Feed</a>
		</p>
	</div>
</section>

<style lang="postcss">
	section {
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: 70ch 1fr;
		column-gap: var(--l);
		row-gap: var(--l);
		width: 100%;
		&.no-sidebar {
			grid-template-columns: 1fr;
			width: 100%;
			.entries {
				grid-column: 1 / -1;
			}
		}
		@media screen and (max-width: 74rem) {
			grid-template-columns: 1fr 18rem;
		}
		@media screen and (max-width: 50rem) {
			grid-template-columns: 1fr;
		}
		.entries {
			width: 100%;
			@media screen and (max-width: 50rem) {
				grid-template-columns: 1fr;
				order: 1;
			}
		}
		.sidebar {
			@media screen and (max-width: 50rem) {
				grid-template-columns: 1fr;
				order: 0;
			}
		}
		.rss {
			grid-column: 1 / -1;
			margin: var(--l) 0 0 0;
			text-align: center;
			@media screen and (max-width: 50rem) {
				grid-column: 1 / 1;
				order: 2;
			}
		}
	}
</style>
