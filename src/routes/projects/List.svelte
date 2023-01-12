<script lang="ts">
	import { entries } from '$lib/data/projects/store';
</script>

<strong>list here</strong>

{$entries.length}
{#each $entries as project}
	<div style="background: tomato;">{project.title}</div>
{/each}
