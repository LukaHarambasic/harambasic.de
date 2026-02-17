<script lang="ts">
	import { onMount } from 'svelte';
	import BaseModal from '$lib/components/Base/BaseModal.svelte';
	import BaseSegmentedButtons from '$lib/components/Base/BaseSegmentedButtons.svelte';
	import BaseToClipboardButton from '$lib/components/Base/BaseToClipboardButton.svelte';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	let baseModalRef: { openModal: () => void } | undefined = $state();

	onMount(() => {
		baseModalRef?.openModal();
	});
</script>

<BaseModal bind:this={baseModalRef} {onClose}>
	<div class="contact-modal">
		<h2 class="header">Get in touch</h2>
		<p class="intro">
			I'm always open to new conversations, whether it's about projects, ideas, or just saying hello.
			Reach out however you prefer.
		</p>
		<div class="contact">
			<div class="group">
				<div class="meta">
					<strong>E-Mail</strong>
					<small>luka@harambasic.de</small>
				</div>
				<BaseSegmentedButtons>
					<a href="mailto:luka@harambasic.de">Write</a>
					<BaseToClipboardButton toClipboard="luka@harambasic.de">Copy</BaseToClipboardButton>
				</BaseSegmentedButtons>
			</div>
			<div class="group">
				<div class="meta">
					<strong>Socials</strong>
					<small>Get in touch!</small>
				</div>
				<BaseSegmentedButtons>
					<a
						href="https://signal.me/#eu/nEQUfJVmtAbHirhDccRIQMkqWOiIiq2/7VROG9o/YrlzrC9ejHlCxYgFg1HMGx2B"
						>Signal</a
					>
					<a href="https://www.linkedin.com/in/harambasic/">LinkedIn</a>
					<a href="https://bsky.app/profile/harambasic.de">BlueSky</a>
					<a href="https://github.com/LukaHarambasic">GitHub</a>
				</BaseSegmentedButtons>
			</div>
			<div class="group">
				<div class="meta">
					<strong>Book a time</strong>
					<small>Wanna talk?</small>
				</div>
				<BaseSegmentedButtons>
					<a href="https://cal.com/luhara/1">Book</a>
				</BaseSegmentedButtons>
			</div>
		</div>
	</div>
</BaseModal>

<style lang="postcss">
	.contact-modal {
		.header {
			margin: 0 0 var(--m) 0;
			font-family: var(--font-family);
			font-size: var(--font-l);
			font-weight: 900;
			line-height: 1.2;
			letter-spacing: var(--font-letter-spacing-headline);
		}
		.intro {
			margin: 0 0 var(--m) 0;
			font-size: var(--font-m);
			line-height: 1.4;
		}
		.contact {
			display: flex;
			width: 100%;
			flex-direction: column;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: stretch;
			align-content: stretch;
			.group {
				display: flex;
				padding: var(--l);
				border-bottom: 1px solid var(--c-surface);
				flex-direction: row;
				flex-wrap: nowrap;
				justify-content: space-between;
				align-items: flex-start;
				align-content: stretch;
				@media screen and (width <= 40rem) {
					flex-direction: column;
					gap: var(--l);
				}
				.meta {
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap;
					justify-content: flex-start;
					align-items: stretch;
					align-content: stretch;
					strong {
						margin: 0 0 var(--xs) 0;
						font-family: var(--font-family);
						font-size: var(--font-m);
						font-weight: 900;
						line-height: 1.2;
						letter-spacing: var(--font-letter-spacing-headline);
					}
					small {
						font-size: var(--font-s);
					}
				}
			}
		}
	}
</style>
