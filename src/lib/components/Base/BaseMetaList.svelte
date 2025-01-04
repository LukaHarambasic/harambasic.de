<script lang="ts">
	interface Props {
		preText: string;
		items: string[];
	}

	let { preText, items }: Props = $props();
</script>

<ul class="meta-list">
	<li><strong>{preText}</strong></li>
	{#each items as item}
		<li>{item}</li>
	{/each}
</ul>
