export const COINS = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  LTC: 'Litecoin',
  USDT: 'Tether',
  USDC: 'USD Coin'
}

export const COIN_ICONS = {
  BTC: ['fab', 'bitcoin'],
  ETH: ['fab', 'ethereum'],
  LTC: ['fab', 'ethereum'],
  USDT: ['fas', 'dollar-sign'],
  USDC: ['fab', 'ethereum']
}

export const COIN_COLORS = {
  BTC: '#ffbc03',
  ETH: '#2a61ff',
  LTC: '#ffbc03',
  USDT: '#2a61ff',
  USDC: '#ffbc03'
}

export const JACKPOT_COLORS = [
  '#7ECEAC', // red
  '#ED886C', // blue
  '#8898C3', // pink
  '#F68CCA', // dark green
  '#A7AAFE', // orange
  '#47CEB0', // dark grey
  '#E34A4D', // purple
  '#2FADD5', // cyan
  '#46AD40', // light grey
  '#F1EEEF', // orange
  '#AFD8CC' // light green
]

export const LEVEL_COLORS = {
  20: '#3B4453',
  40: '#8796C1',
  60: '#7ECEAC',
  80: '#ED886C',
  100: '#FFC30C',
  200: '#70D1F4'
}

export const WHEEL_COLORS = {
  [-7]: '#f39c12',
  [-2]: '#f39c12',
  1: '#c0392b',
  2: '#3dc1d3',
  5: '#16a085',
  10: '#d35400',
  20: '#f78fb3',
  40: '#27ae60'
}

export const WHEEL_DATA = [
  { text: '7x', color: '#f39c12' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 10, color: '#d35400' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 5, color: '#16a085' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 5, color: '#16a085' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 5, color: '#16a085' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 10, color: '#d35400' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 20, color: '#f78fb3' },
  { text: 1, color: '#c0392b' },
  { text: 5, color: '#16a085' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: '2x', color: '#f39c12' },
  { text: 1, color: '#c0392b' },
  { text: 10, color: '#d35400' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 5, color: '#16a085' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 5, color: '#16a085' },
  { text: 40, color: '#27ae60' },
  { text: 1, color: '#c0392b' },
  { text: 10, color: '#d35400' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 5, color: '#16a085' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' },
  { text: 20, color: '#f78fb3' },
  { text: 1, color: '#c0392b' },
  { text: 2, color: '#3dc1d3' },
  { text: 1, color: '#c0392b' }
]

export const getWheel = n => {
  const wheel = []
  for (let i = 0; i < n; i++) {
    wheel.push(WHEEL_DATA)
  }
  return wheel
}

export const PERMISSIONS = {
  VIEW_PANEL: 1,
  VIEW_CONFIGS: 2,
  EDIT_CONFIGS: 4,
  VIEW_USER: 8,
  EDIT_USERS: 16,
  CAN_REFUND: 32,
  CAN_SET_BALANCE: 64,
  CAN_ADD_BALANCE: 128,
  CAN_ADD_MODS: 256,
  CAN_VERIFY_USER: 512,
  CAN_VIEW_STATS: 1024,
  CAN_EDIT_PERMISSIONS: 2048,
  CAN_VIEW_AFFILIATES: 4096,
  CAN_VIEW_TRANSACTIONS: 8192,
  CAN_ELITE_AFFILIATES: 16384,
  SET_USER_TO_WAGER: 32768,
  SUPER_ADMIN: 65536
}
