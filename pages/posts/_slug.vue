<template>
  <post :item="post" />
</template>

<script>
import Post from '@/components/Post'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  components: { Post },
  async asyncData({ $content, params }) {
    const post = await $content('posts', params.slug).fetch()
    return {
      post,
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.post.title,
        description: this.post.description,
        url: `/posts/${this.$route.params.slug}`,
        img: `/posts/${this.post.image}`,
        imgAlt: this.post.alt,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: `${this.post.title} - Luka Harambasic`,
      meta: [
        ...this.meta,
        {
          property: 'article:published_time',
          content: this.post.createdAt,
        },
        {
          property: 'article:modified_time',
          content: this.post.updatedAt,
        },
        {
          property: 'article:tag',
          content: this.post.tags ? this.post.tags.toString() : '',
        },
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: global.author || '' },
        { name: 'twitter:label2', content: 'Filed under' },
        {
          name: 'twitter:data2',
          content: this.post.tags ? this.post.tags.toString() : '',
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${global.baseURL}/posts/${this.$route.params.slug}`,
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
