<script lang="ts">
	import Entries from '$lib/components/Entries/Entries.svelte';
	import Hero from '$lib/components/Hero/Hero.svelte';

	const feeds: Array<{ path: string; description: string }> = [
		{ path: '/rss', description: 'All content: posts, projects, uses, and work.' },
		{ path: '/posts/rss', description: 'Blog posts only.' },
		{ path: '/projects/rss', description: 'Portfolio projects.' },
		{ path: '/uses/rss', description: 'Tools and software I use.' },
		{ path: '/work/rss', description: 'Work experience and positions.' }
	];
</script>

<Entries>
	{#snippet entries()}
		<Hero
			title="Feeds"
			description="I want to expose my data in an open format that can be consumed by everyone who is interested. Either the full feed or just subsets of it."
		/>
		<div class="feeds-list">
			<ul class="list">
				{#each feeds as { path, description }}
					<li class="item">
						<a href={path} class="path" data-sveltekit-reload>{path}</a>
						<p class="description">{description}</p>
					</li>
				{/each}
			</ul>
		</div>
	{/snippet}
</Entries>

<style lang="postcss">
	.feeds-list {
		display: flex;
		margin: var(--xl) auto 0;
		width: 61.8%;
		max-width: calc(var(--layout-xl) * 0.618);
		flex-direction: column;
		gap: var(--l);
		@media screen and (width <= 48rem) {
			width: 100%;
		}
		.list {
			display: flex;
			margin: 0;
			padding: 0;
			flex-direction: column;
			flex-wrap: nowrap;
			gap: var(--l);
			list-style: none;
		}
		.item {
			.path {
				color: var(--c-font);
				font-family: var(--font-family-code);
				font-size: var(--font-m);
				text-decoration: none;
			}
			.path:hover {
				text-decoration: underline;
			}
			.description {
				margin: var(--s) 0 0;
				color: var(--c-font-accent-dark);
				font-family: var(--font-family);
				font-size: var(--font-s);
				line-height: 1.5;
			}
		}
	}
</style>
