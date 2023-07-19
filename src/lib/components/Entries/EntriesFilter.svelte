<script lang="ts">
  import { page } from '$app/stores'
  import type { StatusFilter } from '$lib/types/entry'
  import type { StackEntryStatus, ProjectStatus } from '$lib/types/enums'
  import { enumToArray, setParam } from '$lib/util/helper'
  import { createEventDispatcher } from 'svelte'
  import BaseHeadlineIcon from '../Base/BaseHeadlineIcon.svelte'

  const dispatch = createEventDispatcher()

  export let statusEnum: StatusFilter
  const statuses = enumToArray(statusEnum)
  let status: StatusFilter = ($page.url.searchParams.get('status') as StatusFilter) || 'ALL'
  function onStatusChange() {
    setParam('status', status)
    dispatch('status', status)
  }
</script>

<div class="filter card">
  <BaseHeadlineIcon title="Filter" icon="ph:faders-bold" />
  <div class="selects">
    <div class="wrapper">
      <label for="property">Status</label>
      <select bind:value={status} on:change={onStatusChange} name="property">
        {#each statuses as item}
          <option value={item.key}>{item.display}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

<style lang="postcss">
  .filter {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--m);
    border: var(--border);
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
