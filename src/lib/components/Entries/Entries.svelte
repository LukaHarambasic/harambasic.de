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
		width: 100%;
		row-gap: var(--l);
		column-gap: var(--l);
		grid-template-rows: auto auto auto;
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
		.rss {
			margin: var(--l) 0 0 0;
			grid-column: 1 / -1;
			text-align: center;
			@media screen and (width <= 50rem) {
				order: 2;
				grid-column: 1 / 1;
			}
		}
	}
</style>
