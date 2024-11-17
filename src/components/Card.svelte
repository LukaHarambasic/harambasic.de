<script lang="ts">
  type Direction = 'row' | 'column'

  let { direction = 'row', class: className } = $props<{
    direction?: Direction
    class?: string
  }>()

  let directionClass = $derived(direction === 'column' ? 'column' : 'row')
</script>

<li class={`${className} ${directionClass}`}>
  {@render ...}
</li>

<style lang="postcss">
  li {
    background: green;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--m);
    border-radius: var(--border-radius);
    background: var(--c-surface);
    padding: var(--l);
    border: var(--border);
    @media screen and (max-width: 42rem) {
      flex-direction: column;
    }
    &.column {
      flex-direction: column;
    }
    &.no-spacing {
      padding: 0;
      gap: 0;
    }
  }
</style>
