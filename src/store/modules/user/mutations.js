import Vue from 'vue'

// user
export const setUser = (state, user) => {
  state.user = user
}

export const setBalance = (state, val) => {
  if (!state.user) return
  state.user.balance = val
}

export const addBalance = (state, val) => {
  if (!state.user) return
  state.user.balance += val
}

export const setChatRulesAgree = (state, val) => {
  if (!state.user) return
  state.user.agreeChatRules = val
}

// top up
export const setCryptoAddress = (state, { currency, address }) => {
  if (!state.user) return
  Vue.set(state.user.cryptoAddresses, currency, address)
  // state.user.cryptoAddresses[currency] = address
}


// auth
export const setAuthUrl = (state, val) => {
  state.auth.url = val
}

export const setPopupBlocked = (state, val) => {
  state.auth.popupBlocked = val
}

// inventory
export const setInventory = (state, val) => {
  state.inventory.items = val
}

export const addItems = (state, items) => {
  if (!state.inventory.items) return
  state.inventory.items = [...items, ...state.inventory.items]
}

export const removeItems = (state, toRemove) => {
  if (!state.inventory.items) return

  state.inventory.items = state.inventory.items
    .filter(i => !toRemove.includes(i.backpackId))
}

export const setInventoryLoading = (state, val) => {
  state.inventory.loading = val
}

// affiliate
export const setAffiliate = (state, val) => {
  state.affiliates = val
}

export const setAffiliateCode = (state, val) => {
  if (!state.affiliates) {
    state.affiliates = { code: val }
  }
  state.affiliates.code = val
}

export const setUsedCode = (state, val) => {
  if (!state.user) return
  state.user.affiliateCodeUsed = val
}

export const subtractAffiliateBalance = (state, amount) => {
  if (!state.affiliates) return
  state.affiliates.balance -= amount
}
export const setAffiliateBalance = (state, val) => {
  if (!state.affiliates) return
  state.affiliates.balance = val
}


// history
export const setBetHistory = (state, val) => {
  const history = [...val]
  if (history.length > 50) history.length = 50
  state.history.bets = history
}
export const setBetHistoryGames = (state,val) => {
  const games = [...val]
  if (games.length > 50) games.length = 50
  state.history.games = games
}

export const setPaymentHistory = (state, val) => {
  const history = [...val]
  if (history.length > 30) history.length = 30
  state.history.payments = history
}
