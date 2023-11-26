import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  plugins: [enhancedImages()],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  // TODO check if I wanna use it:
  preprocess: [vitePreprocess({ postcss: true })],
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: ({ path, status, message }) => {
        console.log(status, path, message)
        if (status === 404) {
          return
        }

        // otherwise fail the build
        throw new Error(message)
      }
    }
  }
}

export default config
