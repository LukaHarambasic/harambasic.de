<script lang="ts">
	import { getSlug } from '$lib/util/helper';

	interface Props {
		title: string;
		description?: string;
		permalink?: string;
	}

	let { title, description = '', permalink = 'https://harambasic.de' }: Props = $props();

	const slug = getSlug(title);
	let fullTitle = $derived(title ? `${title} | Luka Harambasic` : 'Luka Harambasic');
	let socialImg = $derived(
		permalink && slug ? `${permalink}/social/${slug}.png` : `${permalink}/social/default.png`
	);
	let socialImgAlt: string = $derived(fullTitle);
</script>

<svelte:head>
	<script
		data-goatcounter="https://luha.goatcounter.com/count"
		async
		src="//gc.zgo.at/count.js"
	></script>
	<!-- Global Metadata -->
	<meta name="viewport" content="width=device-width" />
	<meta name="theme-color" content="#e2ebf0" />
	<meta name="HandheldFriendly" content="True" />
	<link rel="icon" href="/favicon.svg" />
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<!-- Open Graph / Facebook -->
	<meta name="og:type" content="website" />
	<meta name="og:site_name" content="Luka Harambasic" />
	<meta name="og:url" content={permalink} />
	<meta name="og:title" content={fullTitle} />
	<meta name="og:description" content={description} />
	<meta name="og:image" content={socialImg} />
	<meta name="og:image:alt" content={socialImgAlt} />
	<meta name="og:image:width" content="1200" />
	<meta name="og:image:height" content="630" />
	<!-- Twitter -->
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@luka_harambasic" />
	<meta name="twitter:url" content={permalink} />
	<meta name="twitter:image" content={socialImg} />
	<meta name="twitter:image:alt" content={socialImgAlt} />
</svelte:head>

<!-- https://v3-sveltekit--luha-sveltekit.netlify.app/social/almost-free-setup-for-ngos-startups-side-projects.png
https://v3-sveltekit--luha-sveltekit.netlify.app/social/almost-free-setup-for-ngos-startups-and-side-projects.png -->
