import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

import router from './router'

Vue.use(VueAnalytics, {
  id: 'UA-156185827-1',
  router,
  debug: {
    enabled: false,
    // enabled: process.env.NODE_ENV === 'development',
    sendHitTask: process.env.NODE_ENV === 'production'
  },
  autoTracking: {
    exception: process.env.NODE_ENV === 'production'
  }
})
