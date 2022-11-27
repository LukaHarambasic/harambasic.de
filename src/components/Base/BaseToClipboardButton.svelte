<script lang="ts">
	// TODO prettier for svelte
	export let toClipboard: string
	function copyToClipboard() {
		navigator.clipboard.writeText(toClipboard)
	}
</script>

<button class="button" on:click|once={copyToClipboard}>
	<slot />
</button>
