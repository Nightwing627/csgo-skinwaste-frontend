import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import socketActions from './socket_actions'

const state = {
  games: undefined,
  history: undefined
}

export default {
  namespaced: true,
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations
}
