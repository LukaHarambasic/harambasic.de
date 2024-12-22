<script lang="ts">
  type Direction = 'row' | 'column'

  let {
    direction = 'row',
    class: className,
    left,
    right,
    children,
  } = $props<{
    direction?: Direction
    class?: string
    left?: () => any
    right?: () => any
    children: () => any
  }>()

  let directionClass = $derived(direction === 'column' ? 'column' : 'row')
</script>

<li class={`${className} ${directionClass}`}>
  <div class="content">
    {@render children?.()}
  </div>
  {#if left || right}
    <div class="footer">
      {#if left}
        <div class="left">
          {@render left()}
        </div>
      {/if}
      {#if right}
        <div class="right">
          {@render right()}
        </div>
      {/if}
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
    .footer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      background: var(--c-surface-accent);
      padding: var(--s) var(--l);
      border-top: var(--border);
      font-size: var(--font-s);
      .left {
        margin-right: auto;
      }
      .right {
        margin-left: auto;
      }
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
