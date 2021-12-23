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
import { generatePageData } from '@/assets/js/pageData'

export default {
  name: 'Book',
  head() {
    const { title, meta } = generatePageData(
      `Book a Meeting`,
      'Book a meeting with my to talk about opportunities.'
    )
    return {
      title,
      meta: [...meta],
    }
  },
}
</script>

<style scoped></style>
