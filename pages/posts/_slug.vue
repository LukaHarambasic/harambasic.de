<template>
  <posts-details :post="post" />
</template>

<script>
import getSiteMeta from 'assets/js/pageData'
import PostsDetails from '@/components/Posts/PostsDetails'

export default {
  components: { PostsDetails },
  async asyncData({ $content, params }) {
    return {
      post: await $content('posts', params.slug).fetch(),
    }
  },
  head() {
    return {
      title: `${this.post.title}`,
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
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: this.globals.author || '' },
        { name: 'twitter:label2', content: 'Filed under' },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        type: 'article',
        title: this.post.title,
        description: this.post.description,
        url: `/posts/${this.$route.params.slug}`,
        img: `/social/${this.$route.params.slug}.png`,
        imgAlt: this.post.title,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style lang="sass" scoped></style>
