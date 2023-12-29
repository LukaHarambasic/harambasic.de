<section>
	<slot name="sidebar" />
	<div class="entries">
		<slot name="entries" />
	</div>
</section>

<style lang="postcss">
	section {
		display: grid;
		grid-template-rows: auto auto;
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
	}
</style>
