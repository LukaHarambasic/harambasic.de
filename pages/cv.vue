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
      this.addPdfListener()
    })
  },
  methods: {
    addPdfListener() {
      console.log(window.location.origin)
      console.log(window.location.origin.includes('.netlify.app'))
      console.log(process.env.NUXT_ENV_ADOBE_PDF_VIEWER_CLIENT_ID_TESTING)
      console.log(process.env.NUXT_ENV_ADOBE_PDF_VIEWER_CLIENT_ID)
      const clientId = window.location.origin.includes('.netlify.app')
        ? process.env.NUXT_ENV_ADOBE_PDF_VIEWER_CLIENT_ID_TESTING
        : process.env.NUXT_ENV_ADOBE_PDF_VIEWER_CLIENT_ID
      document.addEventListener('adobe_dc_view_sdk.ready', () => {
        // eslint-disable-next-line no-undef
        const adobeDCView = new AdobeDC.View({
          clientId,
          divId: 'inline-pdf-cv',
        })
        adobeDCView.previewFile(
          {
            content: { location: { url: '/cv.pdf' } },
            metaData: { fileName: 'Luka Harambasic - CV' },
          },
          {
            embedMode: 'IN_LINE',
            showDownloadPDF: true,
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
  @media screen and (max-width: $breakpoint-desktop)
    width: 100%
</style>
