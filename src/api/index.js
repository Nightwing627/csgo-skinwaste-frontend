/* eslint-disable import/prefer-default-export */
import * as endpoints from './endpoints'
import axios from '@/modules/axios'

export const user = {
  get: () => axios.get(endpoints.AUTH_GET),
  login: () => axios.get(endpoints.AUTH_LOGIN),
  getInventory: () => axios.get(endpoints.USER_INVENTORY),
  getCryptoAddress: curr => axios.get(`${endpoints.USER_GET_CRYPTO_ADDRESS}/${curr}`),
  getBetHistory: game => axios.get(`${endpoints.USER_HISTORY_BETS}/${game}`, {
    page: 1,
    perPage: 50
  }),
  getPaymentHistory: type => axios.get(endpoints.USER_HISTORY_PAYMENTS, {
    params: { page: 1, perPage: 50, transactionTypes: type.join(',') }
  }),
  sendTip: (items = [], toUserID) => axios.post(endpoints.USER_TIP, { backpackIds: items.join(','), toUserID }),
  setTradeUrl: tradeLink => axios.post(endpoints.USER_TRADE_LINK, { tradeLink })
}

export const chat = {
  get: () => axios.get(endpoints.CHAT_GET)
}

export const payments = {
  rates: () => axios.get(endpoints.PAYMENTS_RATES),
  // withdraw: ({ currency, address, items }) => axios.post(`${endpoints.STORE_CASHOUT}`, { backpackIds: items.join(','), address, currency })
  withdraw: ({ amount, address, currency }) => axios.post(`${endpoints.STORE_CASHOUT}`, { amount, address, currency }),
  gasFee: (address, amount) => axios.post(endpoints.STORE_GAS_FEED, { address, amount })
}

export const affiliate = {
  get: () => axios.get(endpoints.AFFILIATE_GET),
  setCode: code => axios.post(endpoints.AFFILIATE_SET_CODE, { code }),
  useCode: code => axios.post(endpoints.AFFILIATE_USE_CODE, { code }),
  withdraw: amount => axios.post(endpoints.AFFILIATE_WITHDRAW, { amount }),
  collect: () => axios.get(endpoints.AFFILIATE_COLLECT)
}

export const store = {
  get: () => axios.get(endpoints.STORE_GET),
  buy: (items = []) => axios.post(endpoints.STORE_BUY, { itemIds: items.join(',') }),
  sell: (items = []) => axios.post(endpoints.STORE_SELL, { backpackIds: items.join(',') }),
  csgo: () => axios.get(endpoints.STORE_CSGO),
  csgoBuy: (items = []) => axios.post(endpoints.STORE_CSGO_BUY, { itemIds: items.join(',') })
}

export const jackpot = {
  get: () => axios.get(endpoints.JACKPOT_GET),
  bet: (pot, items = []) => axios.post(`${endpoints.JACKPOT_BET}/${pot}`, { itemIds: items.join(',') })
}

export const coinflip = {
  get: () => axios.get(endpoints.COINFLIP_GET),
  getHistory: () => axios.get(endpoints.COINFLIP_HISTORY),
  create: (side, items = []) => axios.post(`${endpoints.COINFLIP_CREATE}`, {
    side,
    backpackIds: items.join(',')
  }),
  join: (gameId, items = []) => axios.post(`${endpoints.COINFLIP_JOIN}`, {
    gameId,
    backpackIds: items.join(',')
  }),
  cancel: gameId => axios.delete(endpoints.COINFLIP_DELETE, { data: { gameId } })
}

export const wheel = {
  get: () => axios.get(endpoints.WHEEL_GET),
  bet: bets => axios.post(endpoints.WHEEL_BET, { bets: JSON.stringify(bets) })
}

export const config = {
  get: () => axios.get(endpoints.CONFIG_GET)
}

export const admin = {
  getStats: (type, start, end) => axios.get(endpoints.ADMIN_GETSTATS, { params: { type, start, end } }),
  getDryRun: (date = new Date().toISOString().split('T')[0]) => axios.get(`${endpoints.ADMIN_GETDRYRUN}/${date}`),
  getUser: id => axios.get(`${endpoints.ADMIN_GETUSER}/${id}`),
  getUsers: params => axios.get(`${endpoints.ADMIN_GETUSERS}`, { params }),
  giveBalance: (amount, type, userID, multiplier) => axios.post(endpoints.ADMIN_GIVEBALANCE, {
    amount,
    type,
    userID,
    multiplier
  }),
  ban: (id, level) => axios.post(`${endpoints.ADMIN_GETUSER}/${id}/${level}`),
  searchAffiliates: params => axios.get(endpoints.ADMIN_AFFILIATES, { params }),
  updateEnabled: enabled => axios.post(endpoints.ADMIN_UPDATE_ENABLED, {
    enabled: JSON.stringify(enabled)
  }),
  updateMaint: message => axios.post(endpoints.ADMIN_TOGGLE_MAINT, { message })
}

export const debug = {
  fakeBet: (pot = 'elite') => axios.post(`/test/jackpot/test-bet/true/${pot}`),
  ownFakeBet: (pot = 'elite') => axios.post(`/test/jackpot/test-bet/false/${pot}`)
}

export const leaderboard = {
  getMonthly: () => axios.get(endpoints.GET_LEADERBOARD_MONTHLY),
  getWeekly: () => axios.get(endpoints.GET_LEADERBOARD_WEEKLY)
}

export const promo = {
  // only-admin
  getAllCodes: () => axios.get(endpoints.PROMO_GET_ALL_CODES),
  // only-admin
  createCode: params => axios.post(endpoints.PROMO_CREATE_CODE, params),
  // only-admin
  deleteCode: params => axios.delete(endpoints.PROMO_DELETE_CODE, params),
  useCode: params => axios.post(endpoints.PROMO_USE_CODE, params)
}

export const coinparty = {
  get: () => axios.get(endpoints.GET_COINPARTY),
  create: amount => axios.post(endpoints.CREATE_COINPARTY, { amount }),
  join: () => axios.post(endpoints.JOIN_COINPARTY),
  donate: amount => axios.post(endpoints.DONATE_COINPARTY, { amount })
}

export const roulette = {
  get: () => axios.get(endpoints.ROULETTE_GET),
  bet: (field, amount = 0) => axios.post(endpoints.ROULETTE_BET, { field, amount })
}

export const rewards = {
  get: () => axios.get(endpoints.REWARDS_GET),
  claim: () => axios.post(endpoints.REWARDS_CLAIM)
}

export const rustysell = {
  getURL: () => axios.get(endpoints.GET_RUSTSEEL_URL)
}

export const skinsback = {
  getURL: () => axios.get(endpoints.GET_SKINSBACK_URL)
}
