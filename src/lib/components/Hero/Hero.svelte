<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<section class="hero">
	<h1 class="title">{title}</h1>
	<p class="description">{description}</p>
</section>

<style lang="postcss">
	.hero {
		display: flex;
		margin: 0 auto;
		width: 61.8%;
		max-width: calc(var(--layout-xl) * 0.618);
		flex-direction: column;
		gap: var(--m);
		@media screen and (width <= 48rem) {
			width: 100%;
		}
	.title {
		margin: 0;
		color: var(--c-font);
		font-family: var(--font-family);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 900;
		line-height: 1.15;
		letter-spacing: var(--font-letter-spacing-headline);
	}
	.description {
		margin: 0;
		max-width: 65ch;
		color: var(--c-font-accent-dark);
		font-family: var(--font-family);
		font-size: var(--font-m);
		font-weight: 400;
		line-height: 1.5;
	}
	}
</style>
