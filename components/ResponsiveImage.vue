<template>
  <img
    :lazy-src="_src(src).placeholder"
    :src="_src(src).src"
    :srcset="_src(src).srcSet"
    :alt="alt"
  />
</template>

<script>
export default {
  name: 'ResponsiveImage',
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
  methods: {
    _src: require.context(
      `~/assets/img?resize&sizes[]=320&sizes[]=600&sizes[]=900&sizes[]=1200&placeholder&format=webp`,
      true,
      /\.(png|jpe?g).*$/
    ),
  },
}
</script>

<style scoped></style>
