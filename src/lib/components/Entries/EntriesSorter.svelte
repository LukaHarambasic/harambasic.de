<script lang="ts">
  import { page } from '$app/stores'
  import type { SortProperty } from '$lib/types/entry'
  import { SortDirection } from '$lib/types/enums'
  import { enumToArray, setParam, sortAlphabetical } from '$lib/util/helper'
  import { createEventDispatcher, onMount } from 'svelte'
  import BaseHeadlineIcon from '../Base/BaseHeadlineIcon.svelte'

  const dispatch = createEventDispatcher()

  export let propertiesEnum: SortProperty
  export let propertiesDefault: SortProperty

  const properties = enumToArray(propertiesEnum).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
  let property: SortProperty = propertiesDefault || 'PUBLISHED'
  function onPropertyChange() {
    setParam('property', property)
    dispatch('property', property)
  }

  const directions = enumToArray(SortDirection).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
  let direction: SortDirection = SortDirection.Desc
  function onDirectionChange() {
    setParam('direction', direction)
    dispatch('direction', direction)
  }

  onMount(() => {
    property = ($page.url.searchParams.get('property') as SortProperty) || propertiesDefault || 'PUBLISHED'
    direction = ($page.url.searchParams.get('direction') as SortDirection) || SortDirection.Desc
	});
</script>

<div class="sort card">
  <BaseHeadlineIcon title="Sort" icon="ph:sort-ascending-bold" />
  <div class="selects">
    <div class="wrapper">
      <label for="property">Property</label>
      <select bind:value={property} on:change={onPropertyChange} name="property">
        {#each properties as item}
          <option value={item.key}>{item.display}</option>
        {/each}
      </select>
    </div>
    <div class="wrapper">
      <label for="direction">Direction</label>
      <select bind:value={direction} on:change={onDirectionChange} name="direction">
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
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
    border: var(--border);
    h3 {
      display: flex;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
      gap: 0.25rem;
      span {
        line-height: 1;
      }
      :global(.icon) {
        size: 1.4rem;
      }
    }
    .selects {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--s);
      .wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: stretch;
        justify-content: flex-start;
        align-items: stretch;
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
          border: none;
          padding: 0.25rem 0;
          color: var(--c-font-accent-dark);
          font-size: var(--font-s);
          &:hover {
            cursor: pointer;
            text-decoration: underline;
            text-decoration-thickness: var(--underline-thickness);
          }
        }
      }
    }
  }
</style>
