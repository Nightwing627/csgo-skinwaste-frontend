import { setMute as mute } from '@/modules/sounds'

// config
export const setConfig = (state, val) => {
  state.config = val
}
export const setConfigProperty = (state, { config, property }) => {
  if (!state.config) return

  if (property.includes('jackpot')) {
    const pot = property.replace('jackpot.', '')
    state.config.jackpot[pot] = config
    return
  }

  state.config[property] = config
}

//
export const setConnected = (state, val) => {
  state.socket.connected = val
}

export const setReconnectAttempt = (state, val) => {
  state.socket.reconnectionAttempts = val
}

//
export const setLoaded = (state, val) => {
  state.loaded = val
}

export const setSidebar = (state, val) => {
  state.sidebar.open = val
}
export const setNavSidebar = (state, val) => {
  state.navsidebar.open = val
}

export const setWindowFocus = (state, val) => {
  state.windowFocused = val
}

// sound
export const setMute = (state, val) => {
  mute(val)
  state.sounds.muted = val
}

// Ready
export const setReady = (state, val) => {
  state.ready = val
}

// Loading
export const setLoading = (state, val) => {
  state.loading = val
}
