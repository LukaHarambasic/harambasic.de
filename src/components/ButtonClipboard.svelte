<script lang="ts">
  let { toClipboard, children } = $props<{
    toClipboard: string
    children: () => any
  }>()

  function onCopyToClipboard() {
    console.log(toClipboard)
    navigator.clipboard.writeText(toClipboard)
  }
</script>

<button class="button" onclick={onCopyToClipboard}>
  {@render children()}
</button>
