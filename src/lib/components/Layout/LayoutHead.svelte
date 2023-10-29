<script lang="ts">
  import { getSlug } from "$lib/util/helper"

  export let title: string
  $: fullTitle = title ? `${title} | Luka Harambasic` : 'Luka Harambasic'

  export let description: string = ''

  export let permalink: string = 'https://harambasic.de'

  let socialImgAlt: string = fullTitle

  $: socialImg = `${permalink}/social/${getSlug(title)}.png` && `${permalink}/social/default.png`
</script>

<svelte:head><!-- Statistics -->
  <script data-goatcounter="https://luha.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
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
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Luka Harambasic" />
  <meta property="og:url" content={permalink} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={socialImg} />
  <meta property="og:image:alt" content={socialImgAlt} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <!-- Twitter -->
  <meta property="twitter:title" content={fullTitle} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@luka_harambasic" />
  <meta property="twitter:url" content={permalink} />
  <meta property="twitter:image" content={socialImg} />
  <meta property="twitter:image:alt" content={socialImgAlt} />
</svelte:head>
