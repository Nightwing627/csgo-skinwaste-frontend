export const getUser = state => state.user

export const authUrl = state => state.auth.url
export const popupBlocked = state => state.auth.popupBlocked

export const inventory = state => state.inventory.items
export const inventoryLoading = state => state.inventory.loading

export const affiliates = state => state.affiliates

export const betHistory = state => state.history.bets
export const betHistoryGames = state => state.history.games
export const paymentHistory = state => state.history.payments
