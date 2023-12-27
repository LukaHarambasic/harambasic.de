<script lang="ts">
  import type { PageData } from './$types'
  import '$lib/styles/reset.css'
  import '$lib/styles/fonts.css'
  import '$lib/styles/variables.css'
  import '$lib/styles/base.css'
  import { onMount } from 'svelte'

  export let data: PageData

  const { name, content, imageUrl, fullTitle, description, socialImg, socialImgAlt, greeting, farewell } = data
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

<div class="background" style="background-image: url({imageUrl});"></div>
<main>
  <article class="card rich-text">
    <div class="box">
      <p class="greeting">{greeting}</p>
      <p class="content">{content}</p>
      <p class="farewell">{farewell} <br /> Luka</p>
    </div>
  </article>
  <footer>
    <p>Custom image generated for <em>{name}</em> by OpenAi - DALL·E 3</p>
    <p>Designed & developed by <a href="https://haramabsic.de">Luka Harambasic</a></p>
  </footer>
</main>

<style lang="postcss">
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-position: 50% 50%;
  filter: blur(3px);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
}
main {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  color: rgba(1, 3, 15, 1);
  article {
    margin: var(--l);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--m);
    border-radius: var(--border-radius);
    background: rgba(255, 255, 255, 0.75);
    padding: var(--l);
    border: var(--border);
    .box {
      padding: 0 0 var(--l) 0;
      margin: 0 0 var(--m) 0;
    }
    .greeting, .farewell {
      font-weight: 800;
      font-size: var(--font-xl);
      margin: 0;
      font-style: italic;
    }
    .greeting {
      margin: 0 0 var(--m) 0;
    }
    .content {
      line-height: 1.5;
      margin: 0 0 var(--m) 0;
    }
  }
  footer {
    margin: var(--l) var(--l) var(--xl) var(--l);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    gap: var(--m);
    font-size: var(--font-m);
    border-radius: var(--border-radius);
    background: rgba(255, 255, 255, 0.75);
    padding: var(--l);
    border: var(--border);
    p {
      color: rgba(1, 3, 15, 0.6);
      text-align: center;
      em {
        font-style: italic;
      }
      a {
        color: rgba(1, 3, 15, 0.6);
        font-style: italic;
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
}
</style>
