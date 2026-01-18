<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const { entry, relatedProjects } = data;
</script>

{#if entry}
	<Entry {entry} {relatedProjects} />
{/if}

