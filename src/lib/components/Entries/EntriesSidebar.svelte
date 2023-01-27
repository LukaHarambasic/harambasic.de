<aside>
  <slot />
</aside>

<style lang="postcss">
  aside {
    position: sticky;
    top: var(--l);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--l);
    width: 100%;
  }
</style>
