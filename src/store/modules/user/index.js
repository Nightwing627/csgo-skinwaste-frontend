import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import socketActions from './socket_actions'

const state = {
  user: undefined,
  inventory: {
    items: undefined,
    loading: false
  },
  affiliates: undefined,
  auth: {
    url: null,
    popupBlocked: false
  },
  history: {
    bets: undefined,
    games: undefined,
    payments: undefined
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations
}
