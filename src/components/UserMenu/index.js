import Vue from 'vue'
import UserMenu from './UserMenu.vue'

let component = null

export { UserMenu }

export default {
  create(parent) {
    const UserMenuComponent = Vue.extend(UserMenu)
    component = new UserMenuComponent({
      el: document.createElement('div'),
      parent
    })
  },
  open(e, user, origin) {
    if (!component) return

    const data = {
      id: user.id || user.user_id || user._id,
      steamid: user.steamid || user.steamID || user.steamId,
      username: user.username,
      avatar: user.avatar,
      rank: user.rank,
      level: user.level
    }

    component.$emit('inspect', { e, user: data, origin })
  }
}
