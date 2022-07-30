import { chat as api } from '@/api'
import { errorToast, chat } from '@/utils'

import { SOCKET_CHAT_SEND } from '@/api/endpoints'
import socket from '@/plugins/socket'

export const getChat = async ({ commit }) => {
  try {
    const resp = await api.get()

    const rooms = { ...resp }

    Object.entries(rooms).forEach(([room, messages]) => {
      rooms[room] = messages.map(msg => chat.parseMessage(msg))
    })

    commit('setRooms', rooms)
  } catch (err) {
    errorToast(err)
  }
}

// no arrow func for >this
export const send = async function send({ commit }, { message, room }) {
  commit('setSending', true)

  socket.emit(SOCKET_CHAT_SEND, { message, room }, err => {
    console.log(err)
    commit('setSending', false)
    if (err) {
      errorToast(err)
      return
    }
    commit('setInput', '')
  })
}

export const getMentions = ({ commit }) => {
  api.getMentions().then(resp => commit('setMentions', resp))
}
