import { EVENTS } from '@/api/endpoints'
import i18n from '@/plugins/i18n'
import toast from '@/components/toast'
import modal from '@/components/modal'
import { errorToast } from '@/utils'


export default {
  [`SOCKET_${EVENTS.payments.deposit}`]: ({ commit, dispatch }, { amount }) => {
    commit('addBalance', amount)
    dispatch('getAuth')
    // send notification
    const formattedAmount = (amount / 100).toLocaleString(i18n.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    toast.open({ type: 'info', text: `Your deposit of ${formattedAmount} has been credited to your account.` })
  },
  [`SOCKET_${EVENTS.payments.withdrawal}`]: ({ commit }, { amount }) => {
    // send notification
    const formattedAmount = (amount / 100).toLocaleString(i18n.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    toast.open({ type: 'info', text: `Your withdrawal of ${formattedAmount} has been fulfilled.` })
  },
  [`SOCKET_${EVENTS.payments.tradeRequested}`]: ({ commit }, { itemsTraded, itemsFailed }) => {
    toast.open({ type: 'info', text: 'Your CSGO cashout has been approved.' })

    modal.open('tradeSummary', { maxWidth: 400 }, {
      items: [
        ...itemsTraded,
        ...itemsFailed.map(i => ({ ...i, failed: true }))
      ]
    })
  },
  [`SOCKET_${EVENTS.payments.tradeSent}`]: ({ commit }, { steamTradeID: id }) => {
    modal.open('tradeSent', { maxWidth: 400, persistent: true }, { id })
  },
  [`SOCKET_${EVENTS.payments.tradeDeclined}`]: ({ commit }, err) => {
    errorToast(err)
  }
}
