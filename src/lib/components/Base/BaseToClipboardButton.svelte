<script lang="ts">
	import { once } from 'svelte/legacy';

	interface Props {
		toClipboard: string;
		children?: import('svelte').Snippet;
	}

	let { toClipboard, children }: Props = $props();
	function onCopyToClipboard() {
		navigator.clipboard.writeText(toClipboard);
	}
</script>

<button class="button" onclick={once(onCopyToClipboard)}>
	{@render children?.()}
</button>
