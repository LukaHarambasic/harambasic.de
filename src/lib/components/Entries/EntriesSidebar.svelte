<script lang="ts">
  import Icon from "@iconify/svelte"
  
  let detailsElement: any;
  let isOpen: boolean;

  function handleToggle() {
    isOpen = detailsElement.open;
  }
</script>

<aside>
  <!-- TODO filter and sort for mobile, collapsable -->
  <details open bind:this={detailsElement} on:toggle={handleToggle}>
    <summary class="card hoverable">
      <span>Filter & Sort</span>
      {#if isOpen}
        <Icon icon="ph:x-circle-bold" />
      {:else}
        <Icon icon="ph:funnel-simple-bold" />
      {/if}
    </summary>
    <div class="content">
      <slot />
    </div>
  </details>
</aside>

<style lang="postcss">
  aside {
    position: sticky;
    top: var(--l);
    @media screen and (max-width: 50rem) {
      position: static;
    }
    details {
      summary {
        display: none;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        margin: 0 0 var(--l) 0;
        border-radius: var(--border-radius);
        background: var(--c-font);
        color: var(--c-light);
        padding: var(--m);
        border: var(--border);
        transition: var(--transition);
        &:hover {
          cursor: pointer;
          background: var(--c-surface-accent);
          color: var(--c-font);
        }
        @media screen and (max-width: 50rem) {
          display: flex;
        }
        span {
          font-weight: 900;
          font-size: var(--font-m);
          line-height: 1.2;
          font-family: var(--font-family);
          letter-spacing: var(--font-letter-spacing-headline);
        }
        :global(.icon) {
          size: 1rem;
        }
      }
    }
    .content {
      display: flex !important;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: stretch;
      gap: var(--l);
      width: 100%;
    }
  }
</style>
