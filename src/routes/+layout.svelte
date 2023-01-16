<script>
  import { page } from '$app/stores'
  import '$lib/styles/reset.css'
  import '$lib/styles/variables.css'
  import '$lib/styles/global.css'
  import 'prismjs/themes/prism-tomorrow.css'
  import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
  import LayoutFooter from '$lib/components/Layout/LayoutFooter.svelte'
  import LayoutHeader from '$lib/components/Layout/LayoutHeader.svelte'
  import LayoutHead from '$lib/components/Layout/LayoutHead.svelte'
  import LayoutSkipToContent from '$lib/components/Layout/LayoutSkipToContent.svelte'
  const { title, description, permalink, socialImg, socialImgAlt } = $page.data
</script>

<LayoutHead {title} {description} {permalink} {socialImg} {socialImgAlt} />
<LayoutSkipToContent />
<div class="container">
  <LayoutHeader />
  <main id="main">
    {#if title}
      <section>
        <h1>{title}</h1>
      </section>
    {/if}
    <slot />
  </main>
  <LayoutFooter />
</div>

<style lang="postcss">
  .container {
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr var(--layout-xl) 1fr;
    grid-template-areas: '. header .' '. main .' '. footer .';
    row-gap: var(--xl);
    padding: var(--xl) 0;
    width: 100%;
    height: auto;
    min-height: 100vh;
    :global(> header) {
      grid-area: header;
    }
    > main {
      display: flex;
      grid-area: main;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: stretch;
      justify-content: flex-start;
      align-items: center;
      gap: var(--xl);
      h1 {
        width: 30ch;
        font-weight: 900;
        font-size: var(--font-xl);
        line-height: 1.2;
        font-family: var(--font-family);
        letter-spacing: var(--font-letter-spacing-headline);
        text-align: center;
      }
    }
    :global(> footer) {
      grid-area: footer;
    }
  }
</style>
