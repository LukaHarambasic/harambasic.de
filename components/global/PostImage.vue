<template>
  <nuxt-picture preset="post" :src="src" :alt="alt"></nuxt-picture>
</template>

<script>
export default {
  name: 'PostImage',
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
}
</script>
