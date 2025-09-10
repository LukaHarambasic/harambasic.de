<script lang="ts">
	import type { Tag } from '$lib/types/tag';

	interface Props {
		tag: Tag;
		selected?: boolean;
		onclick?: () => void;
	}

	let { tag, selected = false, onclick }: Props = $props();
</script>

<button class="tag" title={tag.display} class:selected {onclick}>
	#{tag.display}
</button>

<style lang="postcss">
	.tag {
		display: inline-block;
		border: none;
		background: none;
		color: var(--c-font-accent-dark);
		font-size: var(--font-s);
		font-weight: 400;
		font-style: italic;
		text-align: center;
		text-decoration: none;
		&:hover {
			text-decoration: underline;
			cursor: pointer;
		}
		&.selected {
			font-weight: bold;
		}
	}
</style>
