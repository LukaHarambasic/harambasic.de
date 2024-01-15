<section>
	<slot name="sidebar" />
	<div class="entries">
		<slot name="entries" />
	</div>
	<div class="card rss">
		<p>
			Stay up to date via this antiquite but genius technology, called
			<a href="/posts/rss.xml">RSS</a>.
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
		}
	}
</style>
