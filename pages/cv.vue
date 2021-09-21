<template>
  <div class="nuxt-content">
    <div v-if="isWorking">
      <div v-show="isLoading">
        <h2>Loading...</h2>
        <p>
          If you are in a rush you can see it
          <a href="./cv.pdf">here</a>.
        </p>
      </div>
      <div v-show="!isLoading" id="inline-pdf-cv" />
    </div>
    <div v-else>
      <h2>Sorry, something went wrong :(</h2>
      <p>
        It seems that there is a problem getting my CV, you can see and download
        it <a href="./cv.pdf">here</a>.
      </p>
    </div>
  </div>
</template>

<script>
import getSiteMeta from '@/assets/js/getMeta'
export default {
  name: 'Cv',
  layout: 'cv',
  data() {
    return {
      isLoading: true,
      isWorking: true,
    }
  },
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
    setTimeout(() => {
      // if the pdf is still loading after 10000 I assume it isn't working
      this.isWorking = !this.isLoading
      if (!this.isWorking) {
        console.log("PDF can't be loaded, offer manual download")
      }
    }, 10000)
  },
  methods: {
    addPdfListener() {
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
        adobeDCView.registerCallback(
          /* Type of call back */
          // eslint-disable-next-line no-undef
          AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
          /* call back function */
          (event) => {
            if (event.type !== 'APP_RENDERING_DONE') return
            this.isLoading = false
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
