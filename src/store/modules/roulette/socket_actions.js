import { EVENTS } from '@/api/endpoints'

export default {
  [`SOCKET_${EVENTS.roulette.bet}`]: async ({ commit, state }, resp) => {
    commit('addBet', resp)
    // console.log(resp);
  },
  [`SOCKET_${EVENTS.roulette.lock}`]: async ({ commit, state }, resp) => {
    commit('setStatus', 'locked')
    commit('setRoulette', resp)
    // commit('setBets', resp.bets)
  },
  [`SOCKET_${EVENTS.roulette.new}`]: async ({ commit, state }, resp) => {
    commit('setStatus', 'open')
    commit('setRoulette', resp)
    commit('setHistory', resp.history)
    commit('setBets', resp.bets)
  },
  [`SOCKET_${EVENTS.roulette.roll}`]: async ({ commit, state }, resp) => {
    commit('setStatus', 'rolling')
    commit('setRollingRoulette', resp)
    commit('setBets', resp.bets)
  }
}
