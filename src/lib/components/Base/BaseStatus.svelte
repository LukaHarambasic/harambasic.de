<script lang="ts">
	import type { StatusFilter } from '$lib/types/entry';
	import Icon from '@iconify/svelte';

	interface Props {
		status: StatusFilter;
	}

	let { status }: Props = $props();
</script>

{#if status === 'active'}
	<Icon class="status-icon active" icon="ph:play-circle-bold" />
{:else}
	<Icon class="status-icon inactive" icon="ph:pause-circle-bold" />
{/if}

<style lang="postcss">
	:global(.status-icon) {
		margin: 0 0 -0.25rem 1px;
	}
</style>
