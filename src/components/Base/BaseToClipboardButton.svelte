<script>
	// TODO typesript
	// TODO prettier for svelte
	export let toClipboard;
	function copyToClipboard() {
		navigator.clipboard.writeText(toClipboard);
	}
</script>

<button on:click|once={copyToClipboard}>
	<slot />
</button>
