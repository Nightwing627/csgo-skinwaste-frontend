// actual state
export const pots = state => state.pots
export const histories = state => state.history
export const currentPot = state => state.currentPot
export const depositLoading = state => state.loading.deposit

// computed state
export const pot = state => state.pots[state.currentPot]
export const history = state => state.history[state.currentPot]

export const status = (s, getters) => {
  if (!getters.pot) return null
  return getters.pot.status
}

export const roundId = (s, getters) => {
  if (!getters.pot) return null
  return getters.pot.roundId
}

export const open = (s, getters) => {
  if (!getters.pot) return null
  return getters.pot.open
}

export const rollingAt = (s, getters) => {
  if (!getters.pot) return null
  return getters.pot.rollingAt
}

export const pf = (s, getters) => {
  if (!getters.pot) return null
  return getters.pot.pf
}

export const bets = (s, getters) => {
  if (!getters.pot) return []
  return getters.pot.bets
}

export const items = (s, getters) => {
  if (!getters.pot) return []
  return getters.pot.bets
    .reduce((acc, bet) => [...acc, ...bet.items
      .map(i => ({ ...i, userId: bet.userId }))],
    [])
}

export const players = (s, getters) => {
  if (!getters.pot) return {}
  return getters.pot.players
}
