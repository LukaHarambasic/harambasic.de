<!-- From: https://svelte.dev/examples/modal -->

<script lang="ts">
    import Icon from "@iconify/svelte"

	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="content" on:click|stopPropagation>
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
		<button class="close" autofocus on:click={() => dialog.close()}>
            <Icon icon="ph:x-circle-bold" />
        </button>
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
            background: rgba(1, 3, 15, .6);
            @media (prefers-color-scheme: dark) {
                background:rgba(255, 255, 255, .4);
            }
        }
        .content {
            padding: var(--xl);
            .close {
                position: absolute;
                top: var(--l);
                right: var(--l);
                padding: var(--m);
                border: none;
                background: none;
                color: var(--c-font);
                font-size: var(--font-size-l);
                font-weight: bold;
                &:hover {
                    cursor: pointer;
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
