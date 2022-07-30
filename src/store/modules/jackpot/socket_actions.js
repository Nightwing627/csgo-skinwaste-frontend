import { EVENTS } from '@/api/endpoints'
import { parseJackpot, sleep } from '@/utils'
import { debug } from '@/api'

export default {
  [`SOCKET_${EVENTS.jackpot.newRound}`]: async ({ commit, state }, resp) => {
    const pot = resp.potId

    if (state.pots[pot]) {
      const history = { ...state.pots[pot] }
      history.rolledAt = Date.now()
      commit('addHistory', { pot, game: history })
    }

    const data = parseJackpot(resp)
    commit('setPot', { pot, val: data })
  },

  [`SOCKET_${EVENTS.jackpot.start}`]: ({ commit, rootGetters }, resp) => {
    const pot = resp.potId
    const { config } = rootGetters
    if (!config) return

    const timeUntilRoll = Date.now() + (config.jackpot[pot].roundTimeLimit * 1000)
    commit('setRollingAt', { pot, val: timeUntilRoll })
    commit('setStatus', { pot, val: resp.state })
  },
  
  [`SOCKET_${EVENTS.jackpot.closed}`]: ({ commit }, resp) => {
    const pot = resp.potId
    
    commit('setOpen', { pot, val: false })
    commit('setStatus', { pot, val: 'rolling' })
  },

  [`SOCKET_${EVENTS.jackpot.roll}`]: ({ commit }, resp) => {
    const pot = resp.potId
    
    const data = parseJackpot(resp)
    commit('setPot', { pot, val: data })
    
    commit('setRollingAt', { pot, val: Date.now() })
  },

  // player events
  [`SOCKET_${EVENTS.jackpot.newBet}`]: ({ commit }, bet) => {
    const {
      potId: pot, betID: id, bet: amount, items, avatar, username, userID, level, rank, steamid
    } = bet

    commit('setPlayer', {
      pot,
      player: {
        id: userID, avatar, username, level, rank, steamid
      }
    })
    commit('addBet', {
      pot,
      bet: {
        id, amount, items, userId: userID
      }
    })
  }
}
