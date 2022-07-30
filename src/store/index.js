import Vue from 'vue'
import Vuex from 'vuex'

// global state
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

// @TODO: Fix it
// eslint-disable-next-line
import socketActions from "./socket_actions";

// modules
import chat from './modules/chat'
import promo from './modules/promo'

// @TODO: Fix it
// eslint-disable-next-line
import user from "./modules/user";
import jackpot from './modules/jackpot'
import coinflip from './modules/coinflip'
import coinparty from './modules/coinparty'
import roulette from './modules/roulette'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {
  socket: {
    connected: false,
    reconnectionAttempts: 0
  },
  config: null,
  loaded: false,
  navsidebar: {
    open: true
  },
  sidebar: {
    open: true,
    tab: 'chat'
  },
  sounds: {
    muted: false
  },
  windowFocused: true,
  ready: false,
  loading: true
}

export default new Vuex.Store({
  modules: {
    chat,
    user,
    jackpot,
    coinflip,
    coinparty,
    roulette,
    promo
  },
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations,
  strict: debug
})
