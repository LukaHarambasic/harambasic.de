<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	export let data: PageData;
	const entry = data.entry;
</script>

{#if entry}
	<Entry post={entry} />
{/if}
