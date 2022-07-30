import Vue from 'vue'

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import icons from '@/modules/icons'

library.add(...icons)

Vue.component('fai', FontAwesomeIcon)
Vue.component('fal', FontAwesomeLayers)
Vue.component('fat', FontAwesomeLayersText)
