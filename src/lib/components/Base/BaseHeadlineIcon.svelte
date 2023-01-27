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
      line-height: 1;
    }
    :global(.icon) {
      size: 1.4rem;
    }
  }
</style>
