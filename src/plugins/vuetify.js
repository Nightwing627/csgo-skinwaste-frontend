// import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import theme from '@/styles/export.scss'

Vue.use(Vuetify)

export default new Vuetify({
  // icons: {
  //   iconfont: 'fa'
  // },
  theme: {
    dark: true,
    options: {
      customProperties: false
    },
    themes: {
      dark: theme
    }
  }
})
