<script lang="ts">
  let { children } = $props<{
    children: () => any
  }>()
</script>

<div class="segmented-buttons">
  {@render children()}
</div>

<style lang="postcss">
  .segmented-buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: space-between;
    align-items: flex-start;
    border: var(--border);
    border-radius: var(--border-radius-small);
    background: var(--c-surface);
    overflow: hidden;
    @media screen and (max-width: 30rem) {
      width: 100%;
      flex-direction: column;
    }
    :global(.button) {
      transition: var(--transition);
      margin: 0;
      border: none;
      border-right: 1px solid var(--c-surface-accent);
      background: transparent;
      padding: var(--xs) var(--s);
      color: var(--c-font);
      font-weight: 500;
      font-size: var(--font-m);
      line-height: 1.2;
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);
      text-decoration: none;
      text-align: center;
      &:hover {
        cursor: pointer;
        background: var(--c-surface-accent);
        border-right: 1px transparent solid;
      }
      &:last-child {
        border-right: none;
      }
      @media screen and (max-width: 30rem) {
        width: 100%;
        border-right: none;
        &:not(:last-child) {
          border-bottom: 1px solid var(--c-surface-accent);
        }
      }
    }
  }
</style>
