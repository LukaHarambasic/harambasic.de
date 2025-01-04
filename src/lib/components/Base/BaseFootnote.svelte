<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<section class="footnote rich-text">
	<p>
		{@render children?.()}
	</p>
</section>

<style>
	.footnote {
		transition: var(--transition);
		border-radius: var(--border-radius);
		background: var(--c-surface);
		padding: var(--l);
		overflow: hidden;
		color: var(--c-font);
		text-decoration: none;
	}
</style>
