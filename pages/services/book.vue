<template>
  <section>
    <h2>Schedule an appointment</h2>
    <iframe
      src="https://app.simplymeet.me/luha?view=compact"
      style="width: 100%; height: 800px"
      frameborder="0"
      scrolling="yes"
      title="Schedule an appointment"
    ></iframe>
  </section>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'

export default {
  name: 'Book',
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `Book a meeting`,
        img: `/social/book-a-meeting.png`,
        imgAlt: `Book a meeting - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
}
</script>

<style scoped></style>
