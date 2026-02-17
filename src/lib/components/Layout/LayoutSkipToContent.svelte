<!-- TODO isnt working in Firefox -->
<a id="skip-link" href="#main">Skip to main content</a>

<style lang="postcss">
	#skip-link {
		position: absolute;
		transform: translateX(-100%);
		&:focus {
			position: unset;
			transform: unset;
		}
	}
</style>
