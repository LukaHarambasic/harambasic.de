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
		padding: var(--l);
		border-radius: var(--border-radius);
		background: var(--c-surface);
		color: var(--c-font);
		text-decoration: none;
		transition: var(--transition);
		overflow: hidden;
	}
</style>
