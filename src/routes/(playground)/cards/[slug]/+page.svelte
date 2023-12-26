<script lang="ts">
  import type { PageData } from './$types'
  import '$lib/styles/reset.css'
  import '$lib/styles/fonts.css'
  import '$lib/styles/variables.css'
  import '$lib/styles/global.css'
  import { onMount } from 'svelte'
  import { getAddress, type Address } from './getAddress'

  export let data: PageData

  const {name, content, language} = data.card

  let address: Address;
  $: address

  const isDe = language === "de"
  const fullTitle = isDe ? `Post für ${name}` : `Mail for ${name}`
  const description = isDe ? `Luka hat dir eine digitale Postkarte geschickt.` : `Luka sent you a digital postcard.`
  const socialImg = '' // TODO static image
  const socialImgAlt = 'Purely decorative postcard image' 
  const greeting = isDe ? `Hallo ${name},` : `Hello ${name},`
  const farewell = isDe ? "Frohe Weihnachten, " : "Merry Christmas,"
  
  onMount(async () => {
    address = await getAddress()
    console.log(address)
  })

</script>

<svelte:head>
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
  <meta name="twitter:image" content={socialImg} />
  <meta name="twitter:image:alt" content={socialImgAlt} />
</svelte:head>

<main>
  <article class="card rich-text">
    <div class="content">
      <p class="greeting">{greeting}</p>
      <p>{content}</p>
      <p class="farewell">{farewell} <br /> Luka</p>
    </div>
    <div class="address">
      <p>{name}</p>
      {#if address}
        <p>{address.line1}</p>
        <p>{address.line2}</p>
      {:else}
        <p>Fetching your address...</p>
      {/if}
    </div>
  </article>
</main>

<style lang="postcss">
main {
  font-family: var(--font-family);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .card {
    margin: var(--l);
    flex-direction: column;
    align-items: flex-start;
  }
  .greeting, .farewell {
    font-weight: 800;
    font-size: var(--font-xl);
    line-height: 1.2;
    margin: 0;
    font-style: italic;
  }
  .content {
    padding: 0 0 var(--l) 0;
    margin: 0 0 var(--m) 0;
    border-bottom: 1px solid var(--c-font-accent-super-light);
  }
  .address {
    font-style: italic;
  }
}
</style>
