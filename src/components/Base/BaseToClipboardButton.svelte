<script>
	// TODO typesript
	// TODO prettier for svelte
	export let toClipboard;
	function copyToClipboard() {
		navigator.clipboard.writeText(toClipboard);
	}
</script>

<button class="button" on:click|once={copyToClipboard}>
	<slot />
</button>

<style>
	.button {
		border: none;
		background: transparent;
		font-weight: 500;
		font-size: 1rem;
		font-family: 'Source Sans Pro', sans-serif;
		letter-spacing: 0.2px;
		line-height: 1.2;
		border-right: 1px solid rgba(0, 0, 0, 0.05);
		padding: var(--xs) var(--s);
		margin: 0;
		transition: var(--transition);
		text-decoration: none;
		color: var(--c-font);
		&:hover {
			background: rgba(0, 0, 0, 0.05);
			cursor: pointer;
		}
	}
</style>
