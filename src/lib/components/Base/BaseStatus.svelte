<script lang="ts">
	import type { StatusFilter } from '$lib/types/entry';
	import { ProjectStatus, UsesEntryStatus } from '$lib/types/enums';
	import Icon from '@iconify/svelte';

	export let status: StatusFilter;
</script>

{#if status === UsesEntryStatus.Active || status === ProjectStatus.Active}
	<Icon class="status-icon active" icon="ph:play-circle-bold" />
{:else}
	<Icon class="status-icon inactive" icon="ph:pause-circle-bold" />
{/if}

<style lang="postcss">
	:global(.status-icon) {
		margin: 0 0 -4px 1px;
	}
	:global(.active) {
		color: #4ade80;
	}
	:global(.inactive) {
		color: #f87171;
	}
</style>
