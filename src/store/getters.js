// socket
export const connected = state => state.socket.connected
export const reconnectionAttempts = state => state.socket.reconnectionAttempts

// main
export const loaded = state => state.loaded
export const config = state => state.config

// UI
export const sidebar = state => state.sidebar
export const navsidebar = state => state.navsidebar

// SOUND
export const muted = state => state.sounds.muted

// MISC
export const windowFocused = state => state.windowFocused

// READY
export const ready = state => state.ready

// LOADING
export const loading = state => state.loading
