import Vue from 'vue'
import Modal from './modal'
import store from '@/store'
import bugsnag from '@/plugins/bugsnag'

function getModals() {
  const files = require.context('@/modals', true, /[A-Za-z0-9-_,\s]+\.vue$/i)
  const modals = {}
  files.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const modal = matched[1]
      modals[modal] = files(key).default
    }
  })
  return modals
}
const modals = getModals()

const openModals = []
let vm = null

function spawn(propsData, id) {
  if (!vm) throw new Error('No parent vm found')

  const ModalComponent = Vue.extend(Modal)
  return new ModalComponent({
    el: document.createElement('div'),
    propsData,
    parent: vm,
    onClose() {
      openModals.splice(openModals.findIndex(i => i.id === id), 1)
    }
  })
}

export { Modal }
export default {
  open(type, opts, payload) {
    if (!type) return
    if (!modals[type]) return

    const component = modals[type]
    const propsData = { component }

    // auth check
    if (component.needsAuth) {
      const user = store.getters['user/getUser']

      if (!user) {
        propsData.component = modals.auth
        opts.maxWidth = 300
        opts.persistent = true
      }
    }

    const defaultOptions = {
      maxWidth: 900,
      scrollable: true,
      isConfirm: type === 'confirm'
    }

    propsData.options = Object.assign(defaultOptions, opts)

    if (payload) propsData.payload = payload

    // tawk.to integration
    if (window.Tawk_API && window.Tawk_API.isChatOngoing && window.Tawk_API.isChatOngoing()) {
      window.Tawk_API.addEvent('modalOpened', {
        name: type
      }, err => err && console.log(err))
    }

    // bugsnag integration
    bugsnag.leaveBreadcrumb('User opened modal', { type })

    const id = Math.random().toString(36).substr(2, 9)
    openModals.push({ id, component: spawn(propsData, id) })
  },
  assign(data) {
    vm = data
  }
}

export const hasModals = () => !!openModals.length

export const closeNewest = () => {
  if (!openModals.length) return

  const modal = openModals[openModals.length - 1]
  if (modal.component.options.persistent) return

  modal.component.close()
}

window.closeNewest = closeNewest
