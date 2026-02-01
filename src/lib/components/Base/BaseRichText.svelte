<script lang="ts">
	interface Props {
		class?: string;
		element?: 'div' | 'section' | 'footer';
		id?: string;
		children?: import('svelte').Snippet;
	}

	let { class: className, element = 'div', id, children }: Props = $props();
</script>

<svelte:element this={element} class="rich-text {className ?? ''}" {id}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>

<style lang="postcss">
	/* Slot/snippet content is rendered in parent scope; use :global() so descendants match */
	.rich-text {
		line-height: 1.75;
		:global(*) {
			word-wrap: break-word;
			overflow-wrap: break-word;
			word-break: break-word;
			hyphens: auto;
		}
		:global(img) {
			max-width: 100%;
			border-radius: var(--border-radius);
		}
		:global(h2) {
			margin: var(--xl) 0 var(--m) 0;
			width: 30ch;
			font-family: var(--font-family);
			font-size: var(--font-xl);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
			@media screen and (width <= 28rem) {
				width: 100%;
			}
			&:first-of-type {
				margin: 0 0 var(--m) 0;
			}
		}
		:global(h3) {
			margin: var(--l) 0 var(--m) 0;
			width: 30ch;
			font-family: var(--font-family);
			font-size: var(--font-l);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
			@media screen and (width <= 30rem) {
				width: 100%;
			}
		}

		/* If not done specific it overrides other margins */
		:global(> p),
		:global(> ul),
		:global(> ol),
		:global(> blockquote) {
			margin-bottom: var(--l);
			&:last-child {
				margin-bottom: 0;
			}
		}
		:global(hr) {
			margin: var(--l) 0;
			height: 2px;
			border: none;
			border-radius: 10rem;
			background: var(--c-surface-accent);
		}
		:global(a) {
			color: var(--c-font);
			text-decoration: underline;
			text-decoration-thickness: var(--underline-thickness);
			&:hover {
				text-decoration: none;
			}
		}
		:global(strong),
		:global(em) {
			font-weight: 600;
		}
		:global(> ul),
		:global(> ol) {
			margin: var(--l) 0 var(--l) var(--l);
			width: 50ch;
			@media screen and (width <= 50rem) {
				width: calc(100% - var(--l));
			}
			:global(ul),
			:global(ol) {
				margin: 0 0 0 var(--l);
			}
			:global(li) {
				margin: var(--xs) 0 0 0;
			}
		}
		:global(ul) {
			list-style: disc;
		}
		:global(ol) {
			list-style: decimal;
		}
		:global(blockquote) {
			padding: var(--l);
			border-radius: var(--border-radius);
			background: var(--c-surface);
			:global(p) {
				&:last-of-type {
					margin: 0;
				}
			}
		}
		:global(strong) {
			font-weight: 900;
		}
		:global(em) {
			font-style: italic;
		}
	}
</style>
