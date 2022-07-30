import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

const state = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
