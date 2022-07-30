export const setHistory = (state, history) => {
  state.history = history
}

export const setRoulette = (state, roulette) => {
  state.roulette = roulette
}

export const setBets = (state, bets) => {
  state.bets = bets
}

export const addBet = (state, bet) => {
  state.bets.push(bet)
}

export const setStatus = (state, status) => {
  state.status = status
}

export const setRollingRoulette = (state, roulette) => {
  state.rollingRoulette = roulette
}
