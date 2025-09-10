<script lang="ts">
	import { once } from 'svelte/legacy';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		toClipboard: string;
		children?: import('svelte').Snippet;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
	}

	let { toClipboard, children, disabled, type = 'button' }: Props = $props();

	function onCopyToClipboard() {
		navigator.clipboard.writeText(toClipboard);
	}
</script>

<button class="button" {type} {disabled} onclick={once(onCopyToClipboard)}>
	{#if hasSnippet(children)}
		{@render children()}
	{/if}
</button>
