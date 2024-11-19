<script lang="ts">
  type Direction = 'row' | 'column'

  let {
    direction = 'row',
    class: className,
    categoryName,
    children,
  } = $props<{
    direction?: Direction
    class?: string
    categoryName: string
    children: () => any
  }>()

  console.log(categoryName)

  let directionClass = $derived(direction === 'column' ? 'column' : 'row')
</script>

<li class={`${className} ${directionClass}`}>
  <div class="content">
    {@render children()}
  </div>
  {#if categoryName}
    <div class="category">
      {categoryName}
    </div>
  {/if}
</li>

<style lang="postcss">
  li {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: var(--border-radius);
    background: var(--c-surface);
    border: var(--border);
    .content {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: flex-start;
      gap: var(--m);
      padding: var(--l);
    }
    .category {
      width: 100%;
      background: var(--c-surface-accent);
      padding: var(--s) var(--l);
      font-size: var(--font-s);
      font-weight: bold;
      border-top: var(--border);
    }
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
