<script lang="ts">
  export let prefix: string
</script>

<div class="callout">
  {#if prefix}
    <strong>{prefix}</strong>
  {/if}
  <div class="content rich-text">
    <slot />
  </div>
</div>

<style lang="postcss">
  .callout {
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
    strong {
      display: inline;
      border-radius: var(--border-radius-small);
      background: var(--c-surface-accent);
      padding: var(--s) var(--m);
      font-weight: 900;
      font-size: var(--font-m);
      font-family: var(--font-family);
      letter-spacing: var(--font-letter-spacing-headline);
    }
  }
</style>
