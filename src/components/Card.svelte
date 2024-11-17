<script lang="ts">
  type Direction = 'row' | 'column'

  let {
    direction = 'row',
    class: className,
    children,
  } = $props<{
    direction?: Direction
    class?: string
    children: () => any
  }>()

  let directionClass = $derived(direction === 'column' ? 'column' : 'row')
</script>

<li class={`${className} ${directionClass}`}>
  {@render children()}
</li>

<style lang="postcss">
  li {
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
