<script lang="ts">
  type Direction = 'row' | 'column'

  let {
    direction = 'row',
    class: className,
    categoryName,
    date,
    children,
  } = $props<{
    direction?: Direction
    class?: string
    categoryName: string
    date: { raw: Date; formatted: string }
    children: () => any
  }>()

  let directionClass = $derived(direction === 'column' ? 'column' : 'row')
</script>

<li class={`${className} ${directionClass}`}>
  <div class="content">
    {@render children()}
  </div>
  {#if categoryName || date}
    <div class="footer">
      {#if categoryName}
        <div class="category">
          {categoryName}
        </div>
      {/if}
      {#if date}
        <time class="dt-published" datetime={date.raw}>
          {date.formatted}
        </time>
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
      .category {
        margin-right: auto;
      }
      time {
        font-style: italic;
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
