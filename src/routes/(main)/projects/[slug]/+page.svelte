<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entry = $derived(data.entry);
	let relatedWork = $derived(data.relatedWork);
</script>

{#if entry}
	<Entry {entry} {relatedWork} />
{/if}
