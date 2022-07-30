import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import socketActions from './socket_actions'

const state = {
  active: undefined,
  coinparty: undefined,
  joined: undefined
}

export default {
  namespaced: true,
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations
}
