import Vue from 'vue'
import VueRouter from 'vue-router'

// default loaded routes
import Jackpot from '../views/Jackpot'
import NotFound from '../views/404.vue'

import i18n from './i18n.js'
import { handleTokenParam } from '../utils'
import { hasModals, closeNewest } from '@/components/modal'
import store from '@/store'

import DefaultLayout from '../layouts/default.vue'
import MaintenanceLayout from '../layouts/maintenance.vue'

Vue.use(VueRouter)

// if token param is there, remove it
handleTokenParam()

const routes = [
  {
    path: '/:lang([a-z]{2})',
    component: DefaultLayout,
    async beforeEnter(to, from, next) {
      const { lang } = to.params

      // if lang is not known, swap lang to en
      if (!i18n.availableLocales.includes(lang)) return next(`en${to.fullPath.slice(3)}`)

      if (i18n.locale !== lang) i18n.locale = lang
      return next()
    },
    children: [
      {
        path: '/',
        name: 'home',
        redirect: { name: 'jackpot-elite' }
      },
      {
        path: 'elite',
        name: 'jackpot-elite',
        component: Jackpot
      },
      {
        path: 'silver',
        name: 'jackpot-silver',
        component: Jackpot
      }, {
        path: 'roulette',
        name: 'roulette',
        component: () => import(/* webpackChunkName: "roulette" */ '../views/Roulette')
      },
      {
        path: 'coinflip',
        name: 'coinflip',
        component: () => import(/* webpackChunkName: "coinflip" */ '../views/Coinflip')
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import(/* webpackChunkName: "inventory" */ '../views/Inventory')
      },
      {
        path: 'affiliate',
        name: 'affiliate',
        component: () => import(/* webpackChunkName: "affiliate" */ '../views/Affiliate'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'shop',
        name: 'shop',
        component: () => import(/* webpackChunkName: "shop" */ '../views/Shop')
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import(/* webpackChunkName: "faq" */ '../views/faq.vue')
      },
      {
        path: 'fairness',
        name: 'fairness',
        component: () => import(/* webpackChunkName: "fairness" */ '../views/fairness.vue')
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import(/* webpackChunkName: "tos" */ '../views/tos.vue')
      },
      {
        path: 'leaderboard',
        name: 'leaderboard',
        component: () => import(/* webpackChunkName: "leaderboard" */ '../views/leaderboard.vue')
      },
      {
        path: '*',
        name: '404 locale',
        component: NotFound
      }
    ]
  },
  {
    path: '/maintenance',
    component: MaintenanceLayout,
    children: [
      {
        path: '',
        name: 'maintenance',
        component: () => import(/* webpackChunkName: "maintenance" */ '../views/maintenance.vue')
      }
    ]
  },
  {
    path: '/countdown',
    component: MaintenanceLayout,
    children: [
      {
        path: '',
        name: 'countdown',
        component: () => import(/* webpackChunkName: "countdown" */ '../views/countdown.vue')
      }
    ]
  },
  {
    path: '',
    name: 'no-lang',
    beforeEnter(to, from, next) {
      let lang = 'en'
      if (window.navigator.language) lang = window.navigator.language.slice(0, 2)

      next({ path: lang + to.fullPath, replace: true })
    }
  },
  {
    path: '*',
    name: 'forgot-lang',
    beforeEnter(to, from, next) {
      let lang = 'en'
      if (window.navigator.language) lang = window.navigator.language.slice(0, 2)

      next({ path: lang + to.fullPath, replace: true })
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// back/forward navigation detection
let historyKey = 0

router.beforeEach((to, _from, next) => {
  // FUTURE: get state before this hook

  // const { user } = store.state.user
  // console.log(user)

  // if (to.meta.requiresAuth && !user) {
  //   return next({
  //     name: 'home'
  //   })
  // }
  // console.log('beforeEach:', window.history.state.key)

  if (!window.history.state || !window.history.state.key) return next()

  if (window.history.state.key < historyKey) {
    console.log('back lol')
    window.location.reload(true);
    if (hasModals()) {
      closeNewest()

      return next(false)
    }

    if (store.getters.navsidebar.open && window.innerWidth < 600) {
      store.commit('setNavSidebar', false)

      return next(false)
    }

    return next()
  }

  return next()
})


router.afterEach(to => {
  // support route event
  if (window.Tawk_API && window.Tawk_API.isChatOngoing && window.Tawk_API.isChatOngoing()) {
    window.Tawk_API.addEvent('routeChanged', {
      name: to.name,
      path: to.fullPath
    }, err => err && console.log(err))
  }

  if (!window.history.state || !window.history.state.key) return
  Vue.nextTick(() => {
    historyKey = window.history.state.key
  })
})

export default router
