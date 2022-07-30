import { EVENTS } from '@/api/endpoints'
import { parseCoinflip } from '@/utils'
import i18n from '@/plugins/i18n'
import toast from '@/components/toast'

export default {
  [`SOCKET_${EVENTS.coinflip.new}`]: ({ commit }, game) => {
    commit('addGame', parseCoinflip(game))
  },

  [`SOCKET_${EVENTS.coinflip.joined}`]: ({ commit, rootGetters }, game) => {
    commit('setGame', parseCoinflip(game))

    const user = rootGetters['user/getUser']
    if (user && user._id === game.createdBy) {
      const formattedAmount = (game.pot / 100).toLocaleString(i18n.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      toast.open({
        type: 'info',
        closable: false,
        text: `Someone has joined your ${formattedAmount} coins coinflip!`,
        click: (e, vm) => {
          vm.$modal.open('coinflipView', { maxWidth: 700, noShadow: true }, { coinflip: game.gameID })
        },
        clickText: 'Watch'
      })
    }
  },

  [`SOCKET_${EVENTS.coinflip.flip}`]: ({ commit }, game) => {
    commit('setGame', parseCoinflip(game))
  },

  [`SOCKET_${EVENTS.coinflip.remove}`]: ({ commit }, id) => {
    commit('removeGame', id)
  }
}
