import { coinflip as api } from '@/api'
import { errorToast, parseCoinflip } from '@/utils'
import Errors from '@/utils/errors'


export const get = async ({ commit }) => {
  try {
    const games = await api.get()
    commit('setGames', Object.values(games).map(i => parseCoinflip(i)))
  } catch (err) {
    errorToast(err)
  }
}

export const getHistory = async ({ commit }) => {
  try {
    const games = await api.getHistory()
    commit('setHistory', Object.values(games))
  } catch (err) {
    errorToast(err)
  }
}

export const create = async ({ commit }, { side, itemids = [] }) => {
  try {
    if (!side || !itemids.length) throw new Error(Errors.InvalidParams)

    const resp = await api.create(side, itemids)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}

export const join = async ({ commit }, { id, itemids = [] }) => {
  try {
    if (!id || !itemids.length) throw new Error(Errors.InvalidParams)

    const resp = await api.join(id, itemids)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}

export const cancel = async ({ commit }, id) => {
  try {
    if (!id) throw new Error(Errors.InvalidParams)
    const resp = await api.cancel(id)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}
