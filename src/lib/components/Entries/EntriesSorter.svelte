<script lang="ts">
	import { page } from '$app/stores';
	import type { SortProperty } from '$lib/types/entry';
	import { SortDirection } from '$lib/types/enums';
	import {
		sortPropertyToArray,
		sortDirectionsToArray,
		setParam,
		sortAlphabetical
	} from '$lib/util/helper';
	import { createEventDispatcher, onMount } from 'svelte';
	import BaseHeadlineIcon from '../Base/BaseHeadlineIcon.svelte';

	const dispatch = createEventDispatcher();

	interface Props {
		propertiesArray: readonly string[];
		propertiesDefault?: SortProperty;
	}

	let { propertiesArray, propertiesDefault = 'published' }: Props = $props();

	let properties = $derived(
		sortPropertyToArray(propertiesArray).sort((a, b) => sortAlphabetical(a.key, b.key))
	);

	let property: SortProperty = $state(propertiesDefault);
	function onPropertyChange() {
		setParam('property', property);
		dispatch('propertyChange', property);
	}

	const directions = sortDirectionsToArray().sort((a, b) => sortAlphabetical(a.key, b.key));
	let direction: SortDirection = $state(SortDirection.Desc);
	function onDirectionChange() {
		setParam('direction', direction);
		dispatch('directionChange', direction);
	}

	onMount(() => {
		property = ($page.url.searchParams.get('property') as SortProperty) || propertiesDefault;
		direction = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc;
	});
</script>

<div class="sort card">
	<BaseHeadlineIcon title="Sort" icon="ph:sort-ascending-bold" />
	<div class="selects">
		<div class="wrapper">
			<label for="property">Property</label>
			<select bind:value={property} onchange={onPropertyChange} name="property">
				{#each properties as item}
					<option value={item.key}>{item.display}</option>
				{/each}
			</select>
		</div>
		<div class="wrapper">
			<label for="direction">Direction</label>
			<select bind:value={direction} onchange={onDirectionChange} name="direction">
				{#each directions as item}
					<option value={item.key}>{item.display}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style lang="postcss">
	.sort {
		display: flex;
		border: var(--border);
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: stretch;
		align-content: stretch;
		gap: var(--m);
		.selects {
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			gap: var(--s);
			.wrapper {
				display: flex;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: flex-start;
				align-items: stretch;
				align-content: stretch;
				gap: var(--xs);
				label {
					margin: 0;
					padding: 0;
					color: var(--c-font-accent-dark);
					font-size: var(--font-s);
					font-weight: bold;
				}
				select {
					margin: 0;
					padding: 0.25rem 0;
					border: none;
					color: var(--c-font-accent-dark);
					font-size: var(--font-s);
					&:hover {
						text-decoration: underline;
						cursor: pointer;
						text-decoration-thickness: var(--underline-thickness);
					}
				}
			}
		}
	}
</style>
