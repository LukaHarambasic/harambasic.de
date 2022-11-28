<script lang="ts">
	// TODO prettier for svelte
	export let toClipboard: string
	function onCopyToClipboard() {
		navigator.clipboard.writeText(toClipboard)
	}
</script>

<button class="button" on:click|once={onCopyToClipboard}>
	<slot />
</button>
