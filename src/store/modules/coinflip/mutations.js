import Vue from 'vue'

export const setGames = (state, val) => {
  state.games = val
}
export const setHistory = (state, val) => {
  state.history = val
}

export const addGame = (state, val) => {
  if (!state.games) return
  state.games.push(val)
}

export const setGame = (state, game) => {
  if (!state.games) return

  const index = state.games.findIndex(i => i.id === game.id)
  if (index === -1) return

  Vue.set(state.games, index, game)
}

export const removeGame = (state, id) => {
  if (!state.games) return
  const index = state.games.findIndex(i => i.id === id)
  if (!index) return

  state.games.splice(index, 1)
}
