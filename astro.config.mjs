// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), svelte()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
})
