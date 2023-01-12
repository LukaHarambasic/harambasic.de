<script lang="ts">
	// import List from './List.svelte';
	import BaseFootnote from '$lib/components/Base/BaseFootnote.svelte';
	import type { PageData } from './$types';
	import { init } from '$lib/data/bookmarks/store';
	import { onMount } from 'svelte';
	import type { Bookmark } from '$lib/types/bookmark';

	export let data: PageData;
	const entries: Bookmark[] = data.entries;

	onMount(() => {
		init(entries);
	});
</script>

{entries[0].title}
<!-- <List /> -->
<BaseFootnote>
	<!-- TODO adapt urls -->
	Check out the <a href="globals.blogFeedURL">RSS feed</a> or
	<a href="TODO">my Twitter account</a>
	to keep up to date.
</BaseFootnote>
