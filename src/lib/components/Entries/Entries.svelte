<script lang="ts">
  import EntriesSidebar from './EntriesSidebar.svelte'
</script>

<section>
  <slot name="sidebar" />
  <div class="entries">
    <slot name="entries" />
  </div>
</section>

<style lang="postcss">
  section {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 70ch;
    column-gap: var(--l);
    row-gap: var(--l);
    width: 100%;
    .entries {
      width: 100%;
    }
  }
</style>
