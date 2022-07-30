import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import socketActions from './socket_actions'

const state = {
  // input
  sending: false,
  input: '',

  currentRoom: 'en', // TODO: save to localstorage
  rooms: null,

  onlineCount: 0,
  users: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations
}
