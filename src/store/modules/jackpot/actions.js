import { jackpot as api } from '@/api'
import { errorToast, parseJackpot } from '@/utils'
import Errors from '@/utils/errors'


export const get = async ({ commit }) => {
  try {
    const { elite, silver, history } = await api.get()

    const pots = { elite, silver }
    const parsed = {}

    Object.entries(pots).forEach(([name, pot]) => {
      parsed[name] = parseJackpot(pot)
    })

    commit('setPots', parsed)

    // const history = {}
    Object.entries(history).forEach(([name, pots]) => {
      commit('setHistory', {
        pot: name,
        history: pots.map(i => parseJackpot(i))
      })
    })
  } catch (err) {
    errorToast(err)
  }
}

export const bet = async ({ commit }, { pot, itemids = [] }) => {
  try {
    if (!pot || !itemids.length) throw new Error(Errors.InvalidParams)
    commit('setDepositLoading', true)

    const resp = await api.bet(pot, itemids)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  } finally {
    commit('setDepositLoading', false)
  }
}
