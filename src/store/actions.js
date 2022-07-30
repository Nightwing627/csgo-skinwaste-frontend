import { errorToast } from '@/utils'
import { config as api } from '@/api'

/* eslint-disable import/prefer-default-export */

export const getConfig = async ({ commit }) => {
  try {
    const config = await api.get()
    commit('setConfig', config)
  } catch (e) {
    errorToast(e)
    throw e
  }
}

/* eslint-enable import/prefer-default-export */
