<script lang="ts">
  export let preText: string
  export let items: string[]
</script>

<ul class="meta-list">
  <li><strong>{preText}</strong></li>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>
