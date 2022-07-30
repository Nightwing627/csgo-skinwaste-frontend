import io from 'socket.io-client'

const socket = io(CONFIG.socket.url, {
  transports: ['websocket'],
  query: {
    token: localStorage.getItem('token')
  }
})

export default socket

export const reconnect = () => {
  console.log('reconnect called')
  socket.io.opts.query = {
    token: localStorage.getItem('token')
  }

  socket.close()
  socket.connect()
  // socket.io.engine.close()
}
