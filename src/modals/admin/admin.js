import { mapGetters } from 'vuex'

import { PERMISSIONS } from '@/utils/constants'

import ViewStats from './views/stats'
import ViewUser from './views/user'
import ViewConfig from './views/config'
import ViewUsers from './views/users'

export default {
  needsAuth: true,
  name: 'ModalAdmin',
  components: {
    ViewStats,
    ViewUser,
    ViewConfig,
    ViewUsers
  },
  props: ['close', 'options', 'payload'],
  metaInfo: {
    title: 'Admin Panel'
  },
  data() {
    return {
      loading: false,
      tab: 0,
      permissions: PERMISSIONS
    }
  },
  created() {
    if (!this.user || this.user.rank < 2 || !this.hasPermission(PERMISSIONS.VIEW_PANEL)) this.close()

    if (this.hasPermission(PERMISSIONS.VIEW_STATS)) this.tab = 0
    else if (this.hasPermission(PERMISSIONS.VIEW_USER)) this.tab = 2
    else this.close()
  },
  async mounted() {
    console.log(this.hasPermission(PERMISSIONS.VIEW_PANEL))
    if (this.payload && this.payload.userid) {
      this.tab = this.hasPermission(PERMISSIONS.VIEW_STATS) ? 3 : 1
      this.$refs.viewUser.$emit('inspect', this.payload.userid)
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    })
  },
  watch: {
    tab(val) {
      console.log(val)
      // if (val === 1 && this.betHistory === undefined) this.getBetHistory()
      // if (val === 2 && this.paymentHistory === undefined) this.getPaymentHistory()
    }
  },
  methods: {
    hasPermission(perm) {
      if (this.user && (this.user.permissions & perm || this.user.permissions & PERMISSIONS.SUPER_ADMIN)) return true
      return false
    },
    lookUpUser(userId) {
      this.tab = this.hasPermission(PERMISSIONS.VIEW_STATS) ? 3 : 1
      this.$refs.viewUser.$emit('inspect', userId)
    }
  }
}
