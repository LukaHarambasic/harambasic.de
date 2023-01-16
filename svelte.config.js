import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
// import importAssets from 'svelte-preprocess-import-assets'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  // TODO check if I wanna use it: importAssets(), 
  preprocess: [vitePreprocess({ postcss: true })],

  kit: {
    adapter: adapter()
  }
}

export default config
