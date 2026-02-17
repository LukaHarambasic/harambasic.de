<!-- From: https://svelte.dev/examples/modal -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { hasSnippet } from '$lib/util/snippet';

	interface Props {
		children?: import('svelte').Snippet;
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { children, onClose }: Props = $props();

	let dialog: HTMLDialogElement | undefined = $state();

	export function openModal() {
		dialog?.showModal();
	}

	function handleDialogClick(event: MouseEvent) {
		if (event.target === dialog) {
			dialog?.close();
		}
	}

	function handleDialogClose() {
		onClose?.();
	}
</script>

<dialog bind:this={dialog} onclick={handleDialogClick} onclose={handleDialogClose}>
	<div class="content">
		{#if hasSnippet(children)}
			{@render children()}
		{/if}
		<form method="dialog">
			<button class="close"><Icon icon="ph:x-circle-bold" /></button>
		</form>
	</div>
</dialog>

<style lang="postcss">
	dialog {
		margin: auto;
		width: 54em;
		border: var(--border);
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		background: var(--c-light);
		color: var(--c-font);
		&::backdrop {
			background: rgba(1, 3, 15, 0.6);
			@media (prefers-color-scheme: dark) {
				background: rgba(255, 255, 255, 0.4);
			}
		}
		.content {
			padding: var(--xl);
			@media screen and (width <= 64rem) {
				padding: var(--l);
			}
			.close {
				--icon-size: 1.5rem;
				--icon-padding: 0.5rem;

				display: flex;
				position: absolute;
				top: var(--l);
				right: var(--l);
				z-index: 3000;
				padding: var(--icon-padding);
				size: calc(var(--icon-size) + var(--icon-padding) * 2);
				border: none;
				border-radius: 50%;
				background: transparent;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
				color: var(--c-font);
				font-size: var(--icon-size);
				transition: var(--transition);
				cursor: pointer;
				:global(svg) {
					width: var(--icon-size);
					height: var(--icon-size);
					transition: var(--transition);
				}
				&:hover {
					:global(svg) {
						transform: scale(1.2);
					}
				}
				@media screen and (width <= 48rem) {
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
			opacity: 1;
		}
	}
</style>
