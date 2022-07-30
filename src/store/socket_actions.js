import { EVENTS } from '@/api/endpoints'
import bugsnag from '@/plugins/bugsnag'


export default {
  [`SOCKET_${EVENTS.connected}`]: ({ commit }) => {
    commit('setConnected', true)
    commit('setReconnectAttempt', 0)

    // bugsnag integration
    bugsnag.leaveBreadcrumb('WebSocket connected')
  },
  [`SOCKET_${EVENTS.disconnected}`]: ({ commit }) => {
    commit('setConnected', false)

    // bugsnag integration
    bugsnag.leaveBreadcrumb('WebSocket disconnected')
  },
  [`SOCKET_${EVENTS.reconnecting}`]: ({ commit }, attempt) => {
    commit('setReconnectAttempt', attempt)
  },
  [`SOCKET_${EVENTS.config.eliteUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'jackpot.elite' })
  },
  [`SOCKET_${EVENTS.config.silverUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'jackpot.silver' })
  },
  [`SOCKET_${EVENTS.config.affiliateUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'affiliate' })
  },
  [`SOCKET_${EVENTS.config.siteUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'site' })
  },
  [`SOCKET_${EVENTS.config.cryptoUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'crypto' })
  },
  [`SOCKET_${EVENTS.config.catcherUpdate}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'catcher' })
  },
  [`SOCKET_${EVENTS.config.roulette}`]: ({ commit }, config) => {
    commit('setConfigProperty', { config, property: 'roulette' })
  }
}
