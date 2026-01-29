<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entry = $derived(data.entry);
	let relatedProjects = $derived(data.relatedProjects);
</script>

{#if entry}
	<Entry {entry} {relatedProjects} />
{/if}
