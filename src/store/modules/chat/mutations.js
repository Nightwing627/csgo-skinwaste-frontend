import Vue from 'vue'

// rooms
export const setRooms = (state, rooms) => {
  state.rooms = rooms
}

export const setRoom = (state, { room, messages }) => {
  if (!state.rooms[room]) return
  state.rooms[room] = messages
}

export const setCurrentRoom = (state, room) => {
  if (!room) return
  state.currentRoom = room
}

// messages

export const receiveMessage = (state, { message, room }) => {
  if (!room) return
  if (!state.rooms) return

  if (state.rooms[room].length >= 60) state.rooms[room].shift()
  state.rooms[room].push(message)
}

export const receiveMessageAll = (state, message) => {
  if (!state.rooms) return

  Object.keys(state.rooms).forEach(lang => {
    if (state.rooms[lang].length >= 60) state.rooms[lang].shift()
    state.rooms[lang].push(message)
  })
}

// mods
export const purgeUser = (state, userId) => {
  Object.values(state.rooms).forEach(messages => {
    messages.forEach(msg => {
      if (!msg.user) return
      if (msg.user.user_id === userId) {
        Vue.set(msg, 'removed', true)
      }
    })
  })
}

// input

export const setSending = (state, val) => {
  state.sending = val
}

export const setInput = (state, input) => {
  state.input = input
}

// misc

export const setUsers = (state, users) => {
  state.users = users
}
export const setOnlineCount = (state, val) => {
  state.onlineCount = val
}
