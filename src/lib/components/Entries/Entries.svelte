<script lang="ts">
	export let path = '';

	$: rssPath = `${path}/rss`;
</script>

<section>
	<div class="entries">
		<slot name="entries" />
	</div>
	<slot name="sidebar" />
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
		@media screen and (max-width: 74rem) {
			grid-template-columns: 1fr 18rem;
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
