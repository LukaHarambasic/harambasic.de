import globals from '@/assets/js/globals.js'

export default {
  data() {
    return {
      globals: {
        ...globals,
        mailto: `mailto:${globals.email}`,
      },
    }
  },
}
