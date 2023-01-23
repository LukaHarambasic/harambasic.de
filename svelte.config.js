import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  // TODO check if I wanna use it: 
  preprocess: [vitePreprocess({ postcss: true })],

  kit: {
    adapter: adapter(),
    prerender: {
      entries: ['*']
    }
  }
}

export default config
