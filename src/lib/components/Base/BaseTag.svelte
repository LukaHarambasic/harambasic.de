<script lang="ts">
	import type { Tag } from '$lib/types/tag';

	interface Props {
		tag: Tag;
		selected?: boolean;
	}

	let { tag, selected = false }: Props = $props();
</script>

<button class="tag" title={tag.display} class:selected>
	#{tag.display}
</button>

<style lang="postcss">
	.tag {
		display: inline-block;
		text-align: center;
		color: var(--c-font-accent-dark);
		font-weight: 400;
		font-size: var(--font-s);
		text-decoration: none;
		font-style: italic;
		background: none;
		border: none;
		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
		&.selected {
			font-weight: bold;
		}
	}
</style>
