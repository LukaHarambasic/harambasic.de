<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{
			name: 'Home',
			url: '/'
		},
		{
			name: 'Projects',
			url: '/projects'
		},
		// {
		//   name: 'Shareable',
		//   url: '/shareable'
		// },
		{
			name: 'Uses',
			url: '/uses'
		},
		{
			name: 'Posts',
			url: '/posts'
		}
	];

	let isActiveRoute = $derived((url: string): boolean => {
		const pathname = $page.url.pathname;
		if (url === '/' && pathname === '/') {
			return true;
		} else if (url !== '/') {
			return pathname.includes(url);
		}
		return false;
	});
</script>

<header>
	<div class="logo">
		<a href="/">Luka Harambasic</a>
	</div>
	<nav>
		<ul>
			{#each links as { name, url }}
				<li><a href={url} class:is-active={isActiveRoute(url)}>{name}</a></li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="postcss">
	header {
		display: flex;
		width: 100%;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: flex-start;
		align-content: stretch;
		@media screen and (width <= 32rem) {
			flex-direction: column;
			align-items: center;
			gap: var(--l);
		}
	}
	.logo {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		gap: var(--m);
		a {
			color: var(--c-font);
			font-family: var(--font-family);
			font-size: var(--font-m);
			font-weight: 900;
			letter-spacing: var(--font-letter-spacing-headline);
			text-decoration: none;
			@media screen and (width <= 26rem) {
				text-align: center;
			}
			&:hover {
				text-decoration: underline;
				text-decoration-thickness: var(--underline-thickness);
			}
		}
	}
	nav {
		ul {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: stretch;
			gap: var(--m);
			@media screen and (width <= 26rem) {
				flex-wrap: wrap;
				justify-content: center;
			}
			li {
				a {
					color: var(--c-font);
					font-family: var(--font-family);
					font-size: var(--font-m);
					font-weight: 600;
					letter-spacing: var(--font-letter-spacing-headline);
					text-decoration: none;
					transition: var(--transition);
					&:hover {
						text-decoration: underline;
						text-decoration-thickness: var(--underline-thickness);
					}
				}
				.is-active {
					text-decoration: underline;
					text-decoration-thickness: var(--underline-thickness);
					&:hover {
						text-decoration: none;
					}
				}
			}
		}
	}
</style>
