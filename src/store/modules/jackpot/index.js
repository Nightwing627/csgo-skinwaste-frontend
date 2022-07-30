import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import socketActions from './socket_actions'

const state = {
  pots: {
    elite: null,
    silver: null
  },
  currentPot: 'elite',
  loading: {
    deposit: false
  },
  history: {
    elite: [],
    silver: []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions: { ...actions, ...socketActions },
  mutations
}
