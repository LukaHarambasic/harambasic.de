import { defineConfig } from 'astro/config';

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  // Enable Vue to support Vue components.
  integrations: [, image()]
});