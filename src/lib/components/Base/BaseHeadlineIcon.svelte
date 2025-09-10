<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		title?: string;
		icon?: string;
	}

	let { title = '', icon = '' }: Props = $props();
</script>

<h3><Icon class="icon" {icon} /><span>{title}</span></h3>

<style lang="postcss">
	h3 {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		gap: 0.25rem;
		span {
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		:global(.icon) {
			size: 1rem;
		}
	}
</style>
