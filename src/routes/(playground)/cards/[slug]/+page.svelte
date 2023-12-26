<script lang="ts">
  import type { PageData } from './$types'
  import '$lib/styles/reset.css'
  import '$lib/styles/fonts.css'
  import '$lib/styles/variables.css'
  import '$lib/styles/global.css'
  import { onMount } from 'svelte'
  import { getAddress, type Address } from './getAddress'
  import { t } from './i18n'

  export let data: PageData

  $: card = data.card

  let language: string
  let name: string
  let content: string
  let fullTitle: string
  let description: string
  let socialImg: string
  let socialImgAlt: string
  let address: Address
  $: address

  console.log('card-out')
  console.log(card)
  if (card) {
    console.log('card-in')
    name = card.name
    language = card.language
    content = card.content
    console.log(name, language, content)
    fullTitle = t('title', language, name)
    description = t('description', language)
    socialImg = t('socialImg', language)
    socialImgAlt = t('socialImgAlt', language)
  }

  onMount(async () => {
    address = await getAddress()
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
      <p class="greeting">{t('greeting', language, name)}</p>
      <p>{content}</p>
      <p class="farewell">{t('farewell', language)} <br /> Luka</p>
    </div>
    <div class="address">
      <p class="name">{name}</p>
      {#if address}
        <p>{address.line1}</p>
        <p>{address.line2}</p>
      {:else}
        <p>{t('addressLoading', language)}</p>
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
    line-height: 1.5;
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
    .name {
      font-weight: 800;
    }
  }
}
</style>
