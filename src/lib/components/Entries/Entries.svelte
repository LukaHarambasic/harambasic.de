<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	$: pathname = '';

	onMount(() => {
		pathname = $page.url.pathname;
	});

	$: rssPath = `${pathname}/rss`;
</script>

<section>
	<slot name="sidebar" />
	<div class="entries">
		<slot name="entries" />
	</div>
	<div class="rss rich-text">
		<p>
			Stay up to date via this antiquite but genius technology, called
			<a href={rssPath}>RSS</a>.
		</p>
	</div>
</section>

<style lang="postcss">
	section {
		display: grid;
		grid-template-rows: auto auto auto;
		grid-template-columns: 1fr 70ch;
		column-gap: var(--l);
		row-gap: var(--l);
		width: 100%;
		@media screen and (max-width: 74rem) {
			grid-template-columns: 18rem 1fr;
		}
		@media screen and (max-width: 50rem) {
			grid-template-columns: 1fr;
		}
		.entries {
			width: 100%;
		}
		.rss {
			grid-column: 1 / -1;
			margin: var(--l) 0 0 0;
			text-align: center;
			@media screen and (max-width: 50rem) {
				grid-column: 1 / 1;
			}
		}
	}
</style>
