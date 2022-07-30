import { EVENTS } from '@/api/endpoints'
import { chat as utils, ID } from '@/utils'
import toast from '@/components/toast'
import { play as playSound } from '@/modules/sounds'

export default {
  [`SOCKET_${EVENTS.chat.message}`]: ({ commit }, resp) => {
    console.log(resp)
    const message = utils.parseMessage(resp.message)

    commit('receiveMessage', { message, room: resp.room })
    if (message.announcement) {
      playSound('announcement', { volume: 0.3 })
    }
  },
  [`SOCKET_${EVENTS.chat.tip}`]: ({ commit }, resp) => {
    const message = {
      id: ID(),
      tip: true,
      ...resp
    }

    commit('receiveMessageAll', message)
  },
  [`SOCKET_${EVENTS.chat.onlineUsers}`]: ({ commit }, { online, users }) => {
    commit('setUsers', users)
    commit('setOnlineCount', online)
  },
  [`SOCKET_${EVENTS.chat.commandComplete}`]: ({ commit }, err) => {
    toast.open({ type: 'info', text: 'Command executed maybe successfully' })
  },
  [`SOCKET_${EVENTS.chat.purge}`]: ({ commit }, userId) => {
    commit('purgeUser', userId)
  },
  [`SOCKET_${EVENTS.chat.clear}`]: ({ commit }, room) => {
    commit('setRoom', { room, messages: [] })
  }
}
