import Vue from 'vue'
import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'
import store from '@/store'

const bugsnagClient = bugsnag({
  apiKey: '3ec1379c569d655856157eb6ba3351ee',
  appVersion: APPVERSION,
  beforeSend: report => {
    // Adjust report here

    const user = store.getters['user/getUser']
    if (user) {
      report.user = user
    }

    // prevent report from sending
    if (process.env.NODE_ENV === 'development') {
      report.ignore()
    }
  }
})
bugsnagClient.use(bugsnagVue, Vue)

export default bugsnagClient
