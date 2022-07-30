/* eslint-disable no-unused-vars */
import { EVENTS } from '@/api/endpoints'
import i18n from '@/plugins/i18n'
import toast from '@/components/toast'
import { play as playSound } from '@/modules/sounds'

export default {
  [`SOCKET_${EVENTS.coinparty.created}`]: ({ commit }, coinparty) => {
    commit('setCoinparty', coinparty)
    commit('setIsJoined', false)
    commit('setIsActive', true)
    playSound('coin_party', { volume: 0.3 })
  },
  [`SOCKET_${EVENTS.coinparty.donated}`]: ({ commit }, { coinparty, user, amount }) => {
    commit('setCoinparty', coinparty)
    commit('setIsActive', true)
  },
  [`SOCKET_${EVENTS.coinparty.joined}`]: ({ commit, rootGetters }, game) => {
    commit('setIsJoined', true)
  },
  [`SOCKET_${EVENTS.coinparty.credited}`]: ({ commit }, game) => {
    commit('setIsActive', false)
  }
}
