import { user as api, affiliate } from '@/api'
import { errorToast, CenteredPopup } from '@/utils'
import { reconnect } from '@/plugins/socket'

// misc
const oauthPopupListener = () => new Promise(res => {
  const resHandler = ({ data }) => {
    if (data.source !== 'oauth') return
    res(data)
    window.removeEventListener('message', resHandler)
  }
  window.addEventListener('message', resHandler)
})

// auth
export const getAuth = async ({ commit }) => {
  if (!localStorage.getItem('token')) {
    commit('setUser', false)
    return false
  }

  try {
    const user = await api.get()

    // reactive data caveat
    if (!user.cryptoAddresses) user.cryptoAddresses = {}

    // cancer fix
    if (user.steamTrade && user.steamTrade.partner && user.steamTrade.token) {
      user.steamTrade.url = `https://steamcommunity.com/tradeoffer/new/?partner=${user.steamTrade.partner}&token=${user.steamTrade.token}`
    } else {
      user.steamTrade = {}
    }

    commit('setUser', user)

    return Promise.resolve()
  } catch (err) {
    commit('setUser', false)

    // remove token if invalid
    if (err.code === 7) {
      localStorage.removeItem('token')
    }

    throw err
  }
}

export const login = async ({ commit }) => {
  try {
    const url = await api.login()
    commit('setAuthUrl', url)

    // check if popup blocked
    try {
      const popup = CenteredPopup(url, 'Authentication', 800, 600)

      popup.focus()
    } catch (e) {
      commit('setPopupBlocked', true)
    }

    const msg = await oauthPopupListener()
    console.log(msg)
    if (!msg.success) throw new Error(msg.error)

    localStorage.setItem('token', msg.response.token)

    reconnect()

    return true
  } catch (e) {
    errorToast(e)
    throw e
  }
}

export const logout = async ({ commit }) => {
  try {
    localStorage.removeItem('token')

    reconnect()
    commit('setUser', false)

    return Promise.resolve()
  } catch (e) {
    errorToast(e)
    return e
  }
}

// inv
export const getInventory = async ({ commit, state }) => {
  if (state.inventory.loading) {
    return
  }

  try {
    commit('setInventoryLoading', true)

    const inventory = await api.getInventory()
    const items = inventory.map(i => ({ ...i.item_id, backpackId: i._id }))

    commit('setInventory', items)
  } catch (err) {
    errorToast(err)
    throw err.data
  } finally {
    commit('setInventoryLoading', false)
  }
}

// payments
export const getCryptoAddress = async ({ commit }, currency) => {
  try {
    const { address } = await api.getCryptoAddress(currency)
    commit('setCryptoAddress', { currency, address })
    return Promise.resolve()
  } catch (err) {
    errorToast(err)
    throw err.data
  }
}

// affiliates
export const getAffiliateStats = async ({ commit }) => {
  try {
    const info = await affiliate.get()
    commit('setAffiliate', info)
  } catch (err) {
    errorToast(err)
  }
}

export const setAffiliateCode = async ({ commit }, code) => {
  try {
    const data = await affiliate.setCode(code)
    const { success, message, placedCode } = data

    if (placedCode) {
      commit('setAffiliateCode', placedCode.code)
    } else if (!success && message) {
      throw message
    }
  } catch (err) {
    if (err.message === 'CODE_TAKEN') {
      errorToast({ ...err, code: 20 })
    } else {
      errorToast(err)
    }

    throw err
  }
}

export const useAffiliateCode = async ({ commit }, code) => {
  try {
    await affiliate.useCode(code)
    commit('setUsedCode', code.toLowerCase())

    return Promise.resolve()
  } catch (err) {
    errorToast(err)
    return Promise.reject(err)
  }
}

export const withdrawAffiliate = async ({ commit }, amount) => {
  try {
    const { affiliateBalance, userBalance } = await affiliate.withdraw(amount)
    commit('setAffiliateBalance', affiliateBalance)
    commit('setBalance', userBalance)

    return Promise.resolve()
  } catch (err) {
    errorToast(err)
    return Promise.reject(err)
  }
}

// history
export const getBetHistory = async ({ commit }, game) => {
  try {
    const { data: history, games } = await api.getBetHistory(game)
    commit('setBetHistory', history)
    commit('setBetHistoryGames', games)
  } catch (e) {
    errorToast(e)
    console.error(e)
  }
}

export const getPaymentHistory = async ({ commit }, type) => {
  try {
    const { data: history } = await api.getPaymentHistory(type)
    commit('setPaymentHistory', history)
  } catch (e) {
    errorToast(e)
    console.error(e)
  }
}
