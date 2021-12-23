<template>
  <posts-details :post="post" />
</template>

<script>
import { generatePageData } from '@/assets/js/pageData'
import PostsDetails from '@/components/Posts/PostsDetails'

export default {
  components: { PostsDetails },
  async asyncData({ $content, params }) {
    return {
      post: await $content('posts', params.slug).fetch(),
    }
  },
  head() {
    const { title, meta } = generatePageData(
      this.post.title,
      this.post.description,
      'article'
    )
    return {
      title,
      meta: [
        ...meta,
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
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
