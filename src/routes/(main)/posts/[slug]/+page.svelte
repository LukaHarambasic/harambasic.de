<script lang="ts">
	import type { PageData } from './$types';
	import Entry from './Entry.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let entry = $derived(data.entry);
</script>

{#if entry}
	<Entry post={entry} />
	<footer class="page-footer">
		<a href="/posts/rss">RSS Feed</a>
	</footer>
{/if}

<style lang="postcss">
	.page-footer {
		margin: var(--l) 0 0 0;
		text-align: center;
		a {
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 600;
			text-decoration: none;
		}
		a:hover {
			text-decoration: underline;
			text-decoration-thickness: var(--underline-thickness);
		}
	}
</style>
