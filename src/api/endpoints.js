export const CONFIG_GET = '/config'

export const AUTH_GET = '/user'
export const AUTH_LOGIN = '/auth/steam'

export const USER_INVENTORY = '/user/inventory'
export const USER_GET_CRYPTO_ADDRESS = '/user/crypto-address'
export const USER_HISTORY_BETS = '/user/history/bets'
export const USER_HISTORY_PAYMENTS = '/user/history/payments'
export const USER_TRADE_LINK = '/user/trade-link'
export const USER_TIP = '/store/tip'

export const PAYMENTS_RATES = '/payments/rates'
export const PAYMENTS_WITHDRAW = '/payments/withdrawal'

export const STORE_GET = '/store'
export const STORE_BUY = '/store/purchase'
export const STORE_SELL = '/store/sell'
export const STORE_CASHOUT = '/store/cashout'
export const STORE_CSGO = '/store/csgo-store'
export const STORE_CSGO_BUY = '/store/buy-csgo'
export const STORE_GAS_FEED = '/store/gas-rate'

export const AFFILIATE_GET = '/affiliates/me'
export const AFFILIATE_SET_CODE = '/affiliates/code'
export const AFFILIATE_USE_CODE = '/affiliates/use-code'
export const AFFILIATE_WITHDRAW = '/affiliates/withdraw'
export const AFFILIATE_COLLECT = '/affiliates/collect'

export const JACKPOT_GET = '/jackpot'
export const JACKPOT_BET = '/jackpot/place-bet'

export const ROULETTE_GET = '/roulette'
export const ROULETTE_BET = '/roulette/place-bet'

export const COINFLIP_GET = '/coinflip'
export const COINFLIP_HISTORY = '/coinflip/history'
export const COINFLIP_CREATE = '/coinflip/create'
export const COINFLIP_JOIN = '/coinflip/join'
export const COINFLIP_DELETE = '/coinflip/delete'

export const WHEEL_GET = '/dream-catcher'
export const WHEEL_BET = '/dream-catcher/place-bet'

export const ADMIN_GETSTATS = '/admin/reports'
export const ADMIN_GETDRYRUN = '/admin/daily-report/true'
export const ADMIN_GETUSER = '/admin/user'
export const ADMIN_GETUSERS = '/admin/users'
export const ADMIN_GIVEBALANCE = '/admin/add-balance'
export const ADMIN_AFFILIATES = '/admin/affiliates'
export const ADMIN_TOGGLE_MAINT = '/admin/toggle-maint'
export const ADMIN_UPDATE_ENABLED = '/admin/update-enabled'
// export const ADMIN = '/admin/place-bet'

export const GET_LEADERBOARD_MONTHLY = '/leaderboard/monthly'
export const GET_LEADERBOARD_WEEKLY = '/leaderboard/weekly'

export const REFRESH_LEADERBOARD_MONTHLY = '/leaderboard/refresh/monthly'
export const REFRESH_LEADERBOARD_WEEKLY = '/leaderboard/refresh/weekly'

export const GET_COINPARTY = '/coinparty/'
export const CREATE_COINPARTY = '/coinparty/create'
export const JOIN_COINPARTY = '/coinparty/join'
export const DONATE_COINPARTY = '/coinparty/donate'

export const REWARDS_GET = '/rewards'
export const REWARDS_CLAIM = '/rewards/claim'

export const CHAT_GET = '/chat'

export const SOCKET_CHAT_SEND = 'chat.sendMessage'

export const GET_RUSTSEEL_URL = '/rustysell/url'

export const GET_SKINSBACK_URL = '/skinsback/url'

export const EVENTS = {
  connected: 'connect',
  disconnected: 'disconnect',
  reconnecting: 'reconnecting',
  appError: 'app.error',
  payments: {
    deposit: 'payments.completeDeposit',
    withdrawal: 'payments.completeWithdrawal',
    tradeSent: 'trade.sent',
    tradeDeclined: 'trade.declined',
    tradeRequested: 'trade.requested'
  },
  chat: {
    message: 'chat.message',
    tip: 'app.tipped',
    onlineUsers: 'chat.connectedUsers',
    commandComplete: 'chat.commandComplete',
    purge: 'chat.purge',
    clear: 'chat.clear'
  },
  config: {
    eliteUpdate: 'config.elite',
    silverUpdate: 'config.silver',
    affiliateUpdate: 'config.affiliate',
    siteUpdate: 'config.site',
    cryptoUpdate: 'config.crypto',
    catcherUpdate: 'config.catcher',
    update: 'config.update',
    roulette: 'config.roulette'
  },
  jackpot: {
    newRound: 'jackpot.newRound',
    newBet: 'jackpot.bet',
    closed: 'jackpot.bettingClosed',
    start: 'jackpot.roundStart',
    roll: 'jackpot.rolling'
  },
  coinflip: {
    new: 'coinflip.newGame',
    joined: 'coinflip.joinGame',
    flip: 'coinflip.flip',
    remove: 'coinflip.remove'
  },
  catcher: {
    new: 'catcher.new',
    start: 'catcher.start',
    lock: 'catcher.lock',
    roll: 'catcher.roll',
    bet: 'catcher.bet'
  },
  coinparty: {
    created: 'coinparty.created',
    joined: 'coinparty.joined',
    donated: 'coinparty.donated',
    credited: 'coinparty.credited'
  },
  roulette: {
    new: 'roulette.new',
    lock: 'roulette.lock',
    roll: 'roulette.roll',
    bet: 'roulette.bet'
  }
}

export const PROMO_GET_ALL_CODES = '/promo'
export const PROMO_CREATE_CODE = '/promo'
export const PROMO_DELETE_CODE = '/promo'
export const PROMO_USE_CODE = '/promo/use'
