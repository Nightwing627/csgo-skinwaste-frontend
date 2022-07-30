import { promo as api } from '@/api'

import { errorToast } from '@/utils'

// eslint-disable-next-line
// export const getAllCodes = async ({ commit }, params) => {
//   try {
//     const response = await api.getAllCodes()

//     console.log(response)
//   } catch (error) {
//     throw error
//   }
// }

// eslint-disable-next-line
// export const createCode = async ({ commit }, params) => {
//   try {
//     const response = await api.createCode(params)

//     console.log(response)
//   } catch (error) {
//     throw error
//   }
// }

// eslint-disable-next-line
// export const deleteCode = async ({ commit }, params) => {
//   try {
//     const response = await api.deleteCode(params)

//     console.log(response)
//   } catch (error) {
//     throw error
//   }
// }

// eslint-disable-next-line
export const useCode = async ({ commit }, params) => {
  try {
    const { success, message } = await api.useCode(params)

    if (!success) {
      throw message
    }
  } catch (error) {
    if (error.message === 'INVALID_CODE') {
      errorToast({ ...error, code: 22 })
    } else {
      errorToast(error)
    }
    throw error
  }
}
