<script lang="ts">
  import type { PageData } from './$types'
  import '$lib/styles/reset.css'
  import '$lib/styles/fonts.css'
  import '$lib/styles/variables.css'
  import '$lib/styles/base.css'

  export let data: PageData

  const { 
    name, 
    content, 
    imageUrl, 
    fullTitle, 
    description, 
    socialImg, 
    socialImgAlt, 
    greeting, 
    farewell,
    frontTitle,
    frontGenerated,
    footerGenerated,
    footerBy
  } = data

  let flipped = false;

  function flipCard() {
    flipped = !flipped;
  }
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <article class="{flipped ? 'flipped' : ''}" on:click={flipCard}>
    <div class="card front">
      <div class="image" style="background-image: url({imageUrl});"></div>
      <p class="title">{frontTitle}</p>
      <p class="generated">{@html frontGenerated}</p>
    </div>
    <div class="card back">
      <p class="greeting">{greeting}</p>
      <p class="content">{content}</p>
      <p class="farewell">{farewell} <br /> Luka</p>
    </div>
  </article>
  <footer>
    <p>{@html footerGenerated}</p>
    <p>{@html footerBy}</p>
  </footer>
</main>

<style lang="postcss">
.background {
  position: fixed;
  top: -1rem;
  left: -1rem;
  right: -1rem;
  bottom: -1rem;
  width: calc(100vw + 2rem);
  height: calc(100vh + 2rem);
  background-position: 50% 50%;
  filter: blur(3px);
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  color: rgba(1, 3, 15, 1);
  article {
    perspective: 1000px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    margin: var(--l) 0 0 0;
  }
  .card {
    position: absolute;
    border-radius: var(--border-radius);
    width: calc(100vw - (var(--l) * 2));
    height: calc(100vh - (var(--l) * 2));
    backface-visibility: hidden;
    transition: transform 0.6s;
    overflow-y: scroll;
    border: solid 5px rgba(0, 0, 0, 0.5);
  }
  .front {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: flex-start;
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
    transform: rotateY(0deg);
    padding: var(--xl) var(--l);
    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      z-index: -1;
    }
    .title {
      font-size: 2.5rem;
      font-weight: 800;
      text-align: center;
      letter-spacing: 1px;
      text-shadow: 
        -3px -3px #ffffff, -2px -3px #ffffff, -1px -3px #ffffff, 0 -3px #ffffff, 1px -3px #ffffff, 2px -3px #ffffff, 3px -3px #ffffff,
        -3px -2px #ffffff, -2px -2px #ffffff, -1px -2px #ffffff, 0 -2px #ffffff, 1px -2px #ffffff, 2px -2px #ffffff, 3px -2px #ffffff,
        -3px -1px #ffffff, -2px -1px #ffffff, -1px -1px #ffffff, 0 -1px #ffffff, 1px -1px #ffffff, 2px -1px #ffffff, 3px -1px #ffffff,
        -3px 0 #ffffff, -2px 0 #ffffff, -1px 0 #ffffff, 1px 0 #ffffff, 2px 0 #ffffff, 3px 0 #ffffff,
        -3px 1px #ffffff, -2px 1px #ffffff, -1px 1px #ffffff, 0 1px #ffffff, 1px 1px #ffffff, 2px 1px #ffffff, 3px 1px #ffffff,
        -3px 2px #ffffff, -2px 2px #ffffff, -1px 2px #ffffff, 0 2px #ffffff, 1px 2px #ffffff, 2px 2px #ffffff, 3px 2px #ffffff,
        -3px 3px #ffffff, -2px 3px #ffffff, -1px 3px #ffffff, 0 3px #ffffff, 1px 3px #ffffff, 2px 3px #ffffff, 3px 3px #ffffff;
    }
    .generated {
      font-size: var(--font-xs);
      font-weight: bold;
      color: rgba(1, 3, 15, 1);
      letter-spacing: 1px;
      text-align: center;
      width: 100%;
      text-shadow: 
        -2px -2px #ffffff, -1px -2px #ffffff, 0 -2px #ffffff, 1px -2px #ffffff, 2px -2px #ffffff,
        -2px -1px #ffffff, -1px -1px #ffffff, 0 -1px #ffffff, 1px -1px #ffffff, 2px -1px #ffffff,
        -2px 0 #ffffff, -1px 0 #ffffff, 1px 0 #ffffff, 2px 0 #ffffff,
        -2px 1px #ffffff, -1px 1px #ffffff, 0 1px #ffffff, 1px 1px #ffffff, 2px 1px #ffffff,
        -2px 2px #ffffff, -1px 2px #ffffff, 0 2px #ffffff, 1px 2px #ffffff, 2px 2px #ffffff;
    }
  }
  .back {
    transform: rotateY(180deg);
    padding: var(--l);
    background: rgba(255, 255, 255, 0.75);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: stretch;
    justify-content: flex-start;
    align-items: flex-start;
    .greeting, .farewell {
      font-weight: 800;
      font-size: var(--font-xl);
      font-style: italic;
    }
    .greeting {
      margin: 0 0 var(--s) 0;
    }
    .content {
      line-height: 1.5;
      margin: 0 0 var(--m) 0;
    }
  }
  .flipped .front {
    transform: rotateY(180deg);
  }
  .flipped .back {
    transform: rotateY(0deg);
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
</style>
