<template>
  <section class="nuxt-content">
    <h2>Imprint</h2>
    <h3>Legal Disclosure</h3>
    Information in accordance with Section 5 TMG
    <h3>Address</h3>
    <ul>
      <li>Bühler Straße 7</li>
      <li>69126 Heidelberg</li>
      <li>Germany</li>
    </ul>
    <h3>Contact Information</h3>
    <ul>
      <li>Name: {{ globals.author }}</li>
      <li>
        E-Mail: <a :href="globals.mailto">{{ globals.email }}</a>
      </li>
    </ul>
    <h3>Graphics and Image Sources</h3>
    <ul>
      <li>{{ globals.author }}</li>
    </ul>
    <h3>Disclaimer</h3>
    <h4>Accountability for content</h4>
    <p>
      The contents of our pages have been created with the utmost care. However,
      we cannot guarantee the contents' accuracy, completeness or topicality.
      According to statutory provisions, we are furthermore responsible for our
      own content on these web pages. In this matter, please note that we are
      not obliged to monitor the transmitted or saved information of third
      parties, or investigate circumstances pointing to illegal activity. Our
      obligations to remove or block the use of information under generally
      applicable laws remain unaffected by this as per §§ 8 to 10 of the
      Telemedia Act (TMG).
    </p>
    <h4>Accountability for links</h4>
    <p>
      Responsibility for the content of external links (to web pages of third
      parties) lies solely with the operators of the linked pages. No violations
      were evident to us at the time of linking. Should any legal infringement
      become known to us, we will remove the respective link immediately.
    </p>
    <h4>Copyright</h4>
    <p>
      Our web pages and their contents are subject to German copyright law.
      Unless expressly permitted by law, every form of utilizing, reproducing or
      processing works subject to copyright protection on our web pages requires
      the prior consent of the respective owner of the rights. Individual
      reproductions of a work are only allowed for private use. The materials
      from these pages are copyrighted and any unauthorized use may violate
      copyright laws.
    </p>

    <h4>Source</h4>
    <a href="http://www.translate-24h.de" target="_blank"
      >Englisch-Übersetzung translate-24h.de</a
    >
  </section>
</template>

<script>
import getSiteMeta from 'assets/js/getMeta'

export default {
  name: 'Imprint',
  computed: {
    meta() {
      const metaData = {
        title: `Imprint`,
        img: `/social/imprint.png`,
        imgAlt: `Imprint - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
    }
  },
}
</script>

<style scoped></style>
