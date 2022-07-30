import { coinparty as api } from '@/api'
import { errorToast } from '@/utils'
import Errors from '@/utils/errors'

function CustomError(message) {
  this.name = 'CustomError';
  this.message = message || '';
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
  this.code = Errors.InvalidParams;
}
CustomError.prototype = Object.create(Error.prototype);

export const create = async ({ commit, dispatch }, { amount }) => {
  try {
    if (isNaN(amount)) throw new CustomError(Errors.InvalidParams)
    const _amount = Math.floor(amount * 100)
    const resp = await api.create(_amount)
    if (resp.error) {
      if (resp.error.code === Errors.CoinPartyAlreadyActive) {
        dispatch('donate', { amount: _amount })
      } else { return errorToast(resp.error) }
    }
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}

export const join = async ({ state, commit }) => {
  try {
    if (state.joined) return
    const resp = await api.join()
    if (resp.error) { if (resp.error.code === Errors.CoinPartyAlreadyJoined) commit('setIsJoined', true) }
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}

export const donate = async ({ commit }, { amount }) => {
  try {
    if (isNaN(amount)) throw new CustomError(Errors.InvalidParams)
    const _amount = Math.floor(amount)
    const resp = await api.donate( _amount)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}

export const get = async ({ state, commit }) => {
  try {
    const resp = await api.get()
    if (resp.error) return// errorToast(resp.error)
    commit('setCoinparty', resp)
    commit('setIsActive', true)
    return resp
  } catch (e) {
    errorToast(e)
    throw e.code
  }
}
