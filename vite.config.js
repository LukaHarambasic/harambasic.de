import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [enhancedImages(), sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
}

export default config
