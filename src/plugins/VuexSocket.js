import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import socket from './socket'
import store from '@/store'

Vue.use(
  new VueSocketIO({
    debug: false,
    // debug: process.env.NODE_ENV === 'development',
    connection: socket,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  })
)
