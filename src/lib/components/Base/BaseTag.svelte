<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import type { Tag } from '$lib/types/tag';

	interface Props {
		tag: Tag;
		selected?: boolean;
	}

	let { tag, selected = false }: Props = $props();
</script>

<button onclick={bubble('click')} class="tag" title={tag.display} class:selected>
	{tag.display}
</button>

<style lang="postcss">
	.tag {
		display: inline-block;
		text-align: center;
		color: var(--c-font-accent-dark);
		font-weight: 400;
		font-size: var(--font-s);
		text-decoration: none;
		padding: var(--xxs) var(--s);
		border-radius: var(--border-radius);
		background: var(--c-surface-accent);
		border: var(--border);
		transition: transform var(--transition-time) var(--transition-ease);
		&:hover {
			text-decoration: none;
			font-weight: bold;
			transform: scale(0.97);
		}
		&::before {
			display: block;
			content: attr(title);
			font-weight: bold;
			height: 0;
			overflow: hidden;
			visibility: hidden;
		}
		&.selected {
			font-weight: bold;
		}
	}
</style>
