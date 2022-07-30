import Vue from 'vue'

// plugins & modules
import plugins from '@/plugins'
import store from '@/store'
import '@/modules/filters'

// App
import App from './App.vue'
import '@/styles/flags.css'
import '@/styles/app.scss'
import '@/styles/helpers.scss'

// components
import Modal from '@/components/modal'
import Toast from '@/components/toast'
import UserMenu from '@/components/UserMenu'

const {
  i18n, router, vuetify, bugsnag
} = plugins

Vue.prototype.$modal = Modal
Vue.prototype.$toast = Toast
Vue.prototype.$bugsnag = bugsnag
Vue.prototype.$userMenu = UserMenu

Vue.prototype.$reCaptchaKey = '6Lfr72ccAAAAALSdtpIwsjWwqx0OoK3N7GfNFpKI'


Vue.config.productionTip = false
Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.config.performance = process.env.NODE_ENV === 'development'

new Vue({
  i18n,
  router,
  store,
  vuetify,
  created() {
    if (process.env.NODE_ENV === 'development') window.vue = this
  },
  render: h => h(App)
}).$mount('#app')

console.log('APP VERSION:', APPVERSION)


// NOTE: lazy boi

// hot fix
// git checkout dev && git merge wip/dev && git push && git checkout master && git merge dev && git push && git checkout wip/dev

// staging merge
// git checkout dev && git merge wip/dev && git push && git checkout wip/dev

// master merge
// git checkout master && git merge dev && git push && git checkout wip/dev
