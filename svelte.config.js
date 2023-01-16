import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'
import importAssets from 'svelte-preprocess-import-assets'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({ postcss: true }), importAssets()],

  kit: {
    adapter: adapter()
  }
}

export default config
