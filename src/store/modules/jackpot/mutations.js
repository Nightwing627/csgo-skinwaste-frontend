export const setCurrent = (state, name) => {
  state.currentPot = name
}

export const setPots = (state, val) => {
  state.pots = val
}

// deposit
export const setDepositLoading = (state, val) => {
  state.loading.deposit = val
}


// main

export const setPot = (state, { pot, val }) => {
  if (!pot) throw new Error('No pot provided')
  state.pots[pot] = val
}

export const setOpen = (state, { pot, val }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].open = val
}

export const setRollingAt = (state, { pot, val }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].rollingAt = val
}

export const setPf = (state, { pot, info }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].pf = info
}

export const setStatus = (state, { pot, val }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].status = val
}

// bets
export const addBet = (state, { pot, bet }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  // if (!state.pots[pot].open) return
  state.pots[pot].bets.push(bet)
}

export const setBets = (state, { pot, bets }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].bets = bets
}

// players
export const setPlayer = (state, { pot, player }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  // if (!state.pots[pot].open) return

  const { players } = state.pots[pot]
  state.pots[pot].players = { [player.id]: player, ...players }
}

export const setPlayers = (state, { pot, players }) => {
  if (!pot) throw new Error('No pot provided')
  if (!state.pots[pot]) return
  state.pots[pot].players = players
}


// history

export const setHistory = (state, { pot, history }) => {
  state.history[pot] = history
}

export const addHistory = (state, { pot, game }) => {
  const games = state.history[pot]
  if (games.length >= 30) games.pop()

  state.history[pot].unshift(game)
}
