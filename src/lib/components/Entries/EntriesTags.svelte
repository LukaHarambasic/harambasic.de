<script lang="ts">
	import { page } from '$app/stores';
	import type { Tag } from '$lib/types/tag';
	import { setParam } from '$lib/util/helper';
	import { createEventDispatcher, onMount } from 'svelte';
	import BaseHeadlineIcon from '$lib/components/Base/BaseHeadlineIcon.svelte';
	import BaseTag from '$lib/components/Base/BaseTag.svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		tags: Tag[];
	}

	let { tags }: Props = $props();

	let tagSlug = $state('all');

	function onTagChange(slug: string) {
		tagSlug = slug;
		setParam('tag', slug);
		dispatch('tagChange', slug);
	}

	onMount(() => {
		tagSlug = $page.url.searchParams.get('tag') || 'all';
	});
</script>

<div class="tags card">
	<BaseHeadlineIcon title="Tags" icon="ph:hash-bold" />
	<ol>
		{#each tags as tag}
			<li>
				<BaseTag
					{tag}
					selected={tagSlug === tag.slug}
					onclick={() => {
						onTagChange(tag.slug);
					}}
				/>
			</li>
		{/each}
	</ol>
</div>

<style lang="postcss">
	.tags {
		display: flex;
		border: var(--border);
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--m);
		grid-area: tags;
		ol {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			gap: var(--s);
		}
	}
</style>
