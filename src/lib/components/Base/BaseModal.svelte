<!-- From: https://svelte.dev/examples/modal -->
<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	export function openModal() {
		dialog?.showModal();
	}
</script>

<dialog bind:this={dialog}>
	<div class="content">
		{@render children?.()}
		<form method="dialog">
			<button class="close"><Icon icon="ph:x-circle-bold" /></button>
		</form>
	</div>
</dialog>

<style lang="postcss">
	dialog {
		width: 54em;
		border-radius: var(--border-radius);
		background: var(--c-light);
		border: var(--border);
		color: var(--c-font);
		margin: auto;
		box-shadow: var(--shadow);
		&::backdrop {
			background: rgba(1, 3, 15, 0.6);
			@media (prefers-color-scheme: dark) {
				background: rgba(255, 255, 255, 0.4);
			}
		}
		.content {
			padding: var(--xl);
			@media screen and (max-width: 64rem) {
				padding: var(--l);
			}
			.close {
				--icon-size: 1.5rem;
				--icon-padding: 0.5rem;
				--icon-border: 2.5px;
				position: absolute;
				top: var(--l);
				right: var(--l);
				color: var(--c-light);
				background: var(--c-font);
				font-size: var(--icon-size);
				size: calc(var(--icon-size) + var(--icon-border) + var(--icon-padding) * 2);
				padding: var(--icon-padding);
				line-height: 1rem;
				vertical-align: 1rem;
				font-weight: bold;
				border-radius: 50%;
				border: var(--icon-border) solid var(--c-surface-accent);
				z-index: 3000;
				:global(svg) {
					margin: -1px 0 0 -1px;
				}
				&:hover {
					cursor: pointer;
					color: var(--c-font);
					background: var(--c-light);
					border-color: var(--c-font);
				}
				@media screen and (max-width: 48rem) {
					top: var(--m);
					right: var(--m);
				}
			}
		}
		&[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}
		&[open]::backdrop {
			animation: fade 0.2s ease-out;
		}
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1);
		}
	}
</style>
