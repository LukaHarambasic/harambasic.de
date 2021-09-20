<template>
  <div id="inline-pdf-cv" />
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'
export default {
  name: 'Cv',
  layout: 'cv',
  head() {
    return {
      title: this.meta.title,
      meta: [...this.meta],
      script: [
        {
          src: 'https://documentcloud.adobe.com/view-sdk/main.js',
        },
      ],
    }
  },
  computed: {
    meta() {
      const metaData = {
        title: `CV`,
        description: 'The CV of Luka Harambasic.',
        url: `/cv`,
        img: `/social/cv.png`,
        imgAlt: `CV - ${this.globals.title}`,
      }
      return getSiteMeta(metaData)
    },
  },
  mounted() {
    this.$nextTick(() => {
      console.log('nextTick')
      this.addPdfListener()
    })
  },
  methods: {
    addPdfListener() {
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        console.log('addEventListener')
        // eslint-disable-next-line no-undef
        const adobeDCView = new AdobeDC.View({
          clientId: '8f3b7a04dc41427db4d6dfb54428b8d6', // TODO process.env.ADOBE_PDF_VIEWER_CLIENT_ID,
          divId: 'inline-pdf-cv',
        })
        adobeDCView.previewFile(
          {
            content: { location: { url: '/cv.pdf' } },
            metaData: { fileName: 'Luka Harambasic - CV' },
          },
          {
            embedMode: 'IN_LINE',
            showDownloadPDF: false,
            showPrintPDF: false,
          }
        )
      })
    },
  },
}
</script>

<style lang="sass" scoped>
#inline-pdf-cv
  width: $size-desktop
  max-width: 100%
</style>
