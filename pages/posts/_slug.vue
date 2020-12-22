<template>
  <posts-details :post="post" />
</template>

<script>
import PostsDetails from '@/components/Posts/PostsDetails'
import global from '@/assets/js/global'
import getSiteMeta from '@/assets/js/getMeta'

export default {
  components: { PostsDetails },
  async asyncData({ $content, params }) {
    return {
      post: await $content('posts', params.slug).fetch(),
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.post.title,
        description: this.post.description,
        url: `/posts/${this.$route.params.slug}`,
        img: `${this.post.image}`,
        imgAlt: this.post.alt,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      // TODO: name form global -> page title
      title: `${this.post.title} - Luka Harambasic`,
      meta: [
        ...this.meta,
        {
          property: 'article:published_time',
          content: this.post.publishedAt,
        },
        {
          property: 'article:modified_time',
          content: this.post.updatedAt,
        },
        {
          property: 'article:tag',
          content: this.post.tags ? this.post.tags.join(', ') : '',
        },
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: global.author || '' },
        { name: 'twitter:label2', content: 'Filed under' },
        {
          name: 'twitter:data2',
          content: this.post.tags ? this.post.tags.join(', ') : '',
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
