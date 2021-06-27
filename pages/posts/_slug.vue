<template>
  <posts-details :post="post" />
</template>

<script>
import PostsDetails from '@/components/Posts/PostsDetails'
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
        img: `/social/${this.$route.params.slug}.png`,
        imgAlt: this.post.title,
      }
      return getSiteMeta(metaData)
    },
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
        {
          property: 'article:tag',
          content: this.post.tags ? this.post.tags.join(', ') : '',
        },
        { name: 'twitter:label1', content: 'Written by' },
        { name: 'twitter:data1', content: this.globals.author || '' },
        { name: 'twitter:label2', content: 'Filed under' },
        {
          name: 'twitter:data2',
          content: this.post.tags ? this.post.tags.join(', ') : '',
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped></style>
