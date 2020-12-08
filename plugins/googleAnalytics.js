import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }) => {
  const getGDPR = localStorage.getItem('GDPR:accepted')

  Vue.use(
    VueGtag,
    {
      config: { id: 'G-WWWZ7H8CN1' },
      appName: 'Harambasic',
      bootstrap: getGDPR === 'true',
      enabled: getGDPR === 'true',
      pageTrackerScreenviewEnabled: true,
    },
    app.router
  )
}
