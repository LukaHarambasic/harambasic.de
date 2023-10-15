<script lang="ts">  
  export let title: string = ''
  const fullTitle = title ? `${title} | Luka Harambasic` : 'Luka Harambasic'

  export let description: string = 'Beautiful description'

  export let permalink: string = 'https://harambasic.de'
  export let relativePath: string
  console.log(`permalink: ${permalink}\nrelativePath: ${relativePath}`)

  const socialImg = `${permalink}/social.png`
  export let socialImgAlt: string = fullTitle

  console.log(
    `title: ${title}\nfullTitle: ${fullTitle}\ndescription: ${description}\npermalink: ${permalink}\nsocialImg: ${socialImg}\nsocialImgAlt: ${socialImgAlt}`
  );
</script>

<svelte:head>
  <!-- TODO include locally -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <!-- TODO replace -->
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
  <!-- Statistics -->
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
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:site" content="@luka_harambasic" />
  <meta property="twitter:url" content={permalink} />
  <meta property="twitter:title" content={fullTitle} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={socialImg} />
  <meta property="twitter:image:alt" content={socialImgAlt} />
</svelte:head>
