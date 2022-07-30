export const messages = state => {
  if (!state.rooms) return null
  return state.rooms[state.currentRoom]
}

export const roomNames = state => {
  if (!state.rooms) return []
  return Object.keys(state.rooms)
}
export const currentRoom = state => state.currentRoom

export const isSending = state => state.sending

export const users = state => state.users
export const onlineCount = state => state.onlineCount
