<script lang="ts">
  import { page } from '$app/stores'
  import { PostSortProperty, SortDirection, type BookmarkSortProperty, type ProjectSortProperty } from '$lib/types/enums'
  import { enumToArray, sortAlphabetical } from '$lib/util/helper'
  import Icon from '@iconify/svelte'

  export let propertiesEnum: PostSortProperty | ProjectSortProperty | BookmarkSortProperty
  const properties: PostSortProperty | ProjectSortProperty | BookmarkSortProperty = enumToArray(propertiesEnum).sort((a: any, b: any) =>
    sortAlphabetical(a.key, b.key)
  )
  $: property = PostSortProperty.Published
  function onPropertyChange() {
    const url = new URL(window.location.toString())
    url.searchParams.set('property', property)
    window.history.pushState({}, '', url.href)
  }

  const directions = enumToArray(SortDirection).sort((a: any, b: any) => sortAlphabetical(a.key, b.key))
  $: direction = SortDirection.Desc
  function onDirectionChange() {
    const url = new URL(window.location.toString())
    url.searchParams.set('direction', direction)
    window.history.pushState({}, '', url.href)
  }
</script>

<div class="sort card">
  <h3><Icon class="icon" icon="ph:faders-bold" /><span>Sort</span></h3>
  <div class="selects">
    <div class="wrapper">
      <label for="property">Property</label>
      <select bind:value={property} on:change={onPropertyChange} name="property">
        {#each properties as property}
          <option value={property.key}>{property.display}</option>
        {/each}
      </select>
    </div>
    <div class="wrapper">
      <label for="direction">Direction</label>
      <select bind:value={direction} on:change={onDirectionChange} name="direction">
        {#each directions as direction}
          <option value={direction.key}>{direction.display}</option>
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
