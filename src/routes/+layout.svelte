<script lang="ts">
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

  // const images: string[] = $page.data.images

  // images.forEach(async (image) => {
  //   console.log(image)
  //   await import(`../lib/images${image}`)
  // })

  // Okay it works, but please make this dynamic!!
  // and lets not forget about the other images: projects, bookmarks can have one if not the favicon should be fetched and saved
  // social images could be moved to static as they are fine as they are
  // https://help.sumologic.com/docs/send-data/reference-information/use-wildcards-paths/
  import.meta.glob(
    [
      '../lib/images/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook/*.png',
      '../lib/images/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook/*.svg',
      '../lib/images/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook/*.jpg',
      '../lib/images/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook/*.gif',
      '../lib/images/posts/adding-github-actions-for-testing-linting-to-all-my-repositories/*.png',
      '../lib/images/posts/almost-free-setup-for-ngos-startups-and-side-projects/*.png',
      '../lib/images/posts/almost-free-setup-for-ngos-startups-and-side-projects/*.jpg',
      '../lib/images/posts/automatically-generate-social-media-images-for-nuxt-js-with-a-git-pre-commit-hook/*.png',
      '../lib/images/posts/custom-search-engines-in-your-browser/*.png',
      '../lib/images/posts/custom-search-engines-in-your-browser/*.gif',
      '../lib/images/posts/docker-compose-for-nextcloud-with-traefik-2-ssh/*.png',
      '../lib/images/posts/my-nerd-path/*.png',
      '../lib/images/posts/my-nerd-path/*.svg',
      '../lib/images/posts/my-perfect-homeoffice-conference-call-and-podcasting-setup/*.mp3',
      '../lib/images/posts/my-perfect-homeoffice-conference-call-and-podcasting-setup/*.jpg',
      '../lib/images/posts/pdf-cvresume-from-figma-template-with-auto-layout/*.png',
      '../lib/images/posts/quickly-copying-paths-to-the-terminal-on-macos/*.gif'
    ],
    { eager: true }
  )

  // import.meta.glob(
  //     ['../lib/images/posts/**/*.png', '../lib/images/posts/**/*.svg', '../lib/images/posts/**/*.jpg', '../lib/images/posts/**/*.gif'],
  //     { eager: true }
  // )
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
