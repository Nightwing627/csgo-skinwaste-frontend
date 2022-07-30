import { mapGetters, mapMutations, mapActions } from 'vuex'

import { PERMISSIONS } from '@/utils/constants'

import User from '@/components/User'
import Navbar from '@/components/Navbar.vue'
import VolumeControl from '@/components/VolumeControl.vue'
import NavbarIcons from '@/components/navbar/Icons.vue'

export default {
  name: 'App',
  components: {
    User,
    Navbar,
    VolumeControl,
    NavbarIcons
  },
  props: {
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      tawk: null,
      supportStatus: 'offline',
      showNavbar: true,
      mobileSpeedDial: false,
      permissions: PERMISSIONS,
      userBalance: 0
    }
  },
  watch: {
    '$vuetify.breakpoint.smAndUp': val => {
      if (val) {
        this.showNavbar = Boolean(val)
      }
    },
    'user.balance': function handler() {
      this.animateBalance()
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      onlineCount: 'chat/onlineCount'
    }),

    supportColor() {
      if (!this.tawk) return 'grey300'
      if (this.supportStatus === 'offline') return 'grey300'
      if (this.supportStatus === 'away') return 'gold'
      if (this.supportStatus === 'online') return 'secondary'
      return 'grey300'
    }
  },
  created() {
    this.$userMenu.create(this)
  },
  async mounted() {
    function loadTawkAPI(onStatusChange) {
      window.Tawk_API = window.Tawk_API || {}
      window.Tawk_LoadStart = new Date()

      if (onStatusChange) window.Tawk_API.onStatusChange = onStatusChange

      const s1 = document.createElement('script')
      s1.async = true
      s1.src = 'https://embed.tawk.to/5e1db9347e39ea1242a4891f/default'
      s1.charset = 'UTF-8'
      s1.setAttribute('crossorigin', '*')

      const s0 = document.getElementsByTagName('script')[0]
      s0.parentNode.insertBefore(s1, s0)

      return new Promise(res => {
        window.Tawk_API.onLoad = res
      })
    }

    // load support shit
    try {
      await loadTawkAPI(this.onStatusChange)
      this.tawk = window.Tawk_API
      this.supportStatus = this.tawk.getStatus()
    } catch (e) {
      console.error(e)
    }

    this.userBalance = await this.user.balance
  },
  methods: {
    ...mapMutations(['setSidebar']),
    ...mapActions({
      initSupport: 'support/init',
      getSupportStatus: 'support/getStatus',
      logout: 'user/logout'
    }),
    animateBalance(step = 20) {
      if (this.userBalance < this.user.balance) {
        const dist = this.user.balance - this.userBalance

        this.userBalance += Math.ceil(dist / step)
      } else if (this.userBalance > this.user.balance) {
        const dist = this.userBalance - this.user.balance

        this.userBalance -= Math.ceil(dist / step)
      }
      setTimeout(() => {
        // eslint-disable-next-line no-plusplus, no-param-reassign
        this.animateBalance(--step)
      }, 1)
    },
    hasPermission(perm) {
      if (
        this.user
        && (this.user.permissions & perm
          || this.user.permissions & PERMISSIONS.SUPER_ADMIN)
      ) return true
      return false
    },
    onStatusChange(status) {
      this.supportStatus = status
    },
    openSupport() {
      if (!this.tawk) return

      if (this.tawk.isChatMaximized()) {
        this.tawk.minimize()
        return
      }

      if (this.user) {
        this.tawk.setAttributes(
          {
            id: this.user._id,
            username: this.user.username,
            steamID: this.user.steamID,
            balance: this.user.balance,
            level: this.user.level,
            rank: this.user.rank,
            banLevel: this.user.banLevel,
            won: this.user.won,
            wagered: this.user.wagered,
            affiliateCodeUsed: this.user.affiliateCodeUsed,
            //
            name: `${this.user.username} (${this.user.steamID})`
            // email needs secure api
          },
          err => err && console.log(err)
        )
      }

      this.tawk.maximize()
    }
  }
}
