<script lang="ts">
  import Icon from '@iconify/svelte'

  export let title = ''
  export let icon = ''
</script>

<h3><Icon class="icon" {icon} /><span>{title}</span></h3>

<style lang="postcss">
  h3 {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    gap: 0.25rem;
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
</style>
