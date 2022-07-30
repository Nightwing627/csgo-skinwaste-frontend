import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortBy from 'lodash.sortby'
import * as api from '@/api'
import { errorToast } from '@/utils'
import Inventory from '@/components/Inventory'


export default {
  needsAuth: true,
  name: 'ModalCSGOCashOut',
  props: ['close', 'options'],
  components: {
    Inventory
  },
  data() {
    return {
      step: 1,
      loading: {
        balance: false,
        tradeurl: false,
        withdraw: false,
        inventory: false
      },
      // inv
      items: [],
      onlyShowAffordable: true,
      search: '',
      // withdraw
      tradeurl: null,
      editing: false
    }
  },
  metaInfo: {
    title: 'CS:GO Cashout'
  },
  watch: {
    loading: {
      handler(val) {
        this.$emit('update:options', { ...this.options, persistent: Object.values(val).some(i => i) })
      },
      deep: true
    },
    step(val) {
      let maxWidth
      if (val === 1) maxWidth = 900
      if (val === 2) maxWidth = 400

      this.$emit('update:options', { ...this.options, maxWidth })
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    }),
    // withdraw
    selected() {
      return this.items.filter(i => i.selected)
    },
    allSelected() {
      if (!this.items.length) return false
      return this.items.every(i => i.selected)
    },
    selectedValue() {
      return this.selected.reduce((acc, i) => acc + i.price, 0)
    },
    filteredItems() {
      if (this.step === 2) return []
      let { items } = this


      if (this.user.balance !== 0 && this.onlyShowAffordable) {
        const affordable = items.filter(i => i.price <= this.user.balance)
        if (affordable.length) items = affordable
      }

      // TODO: settings / make better
      if (this.selectedValue) {
        items.forEach(i => {
          if (i.selected) {
            this.$set(i, 'disabled', false)
            // i.disabled = false
            return
          }

          this.$set(i, 'disabled', i.price >= (this.user.balance - this.selectedValue))

          // i.disabled = i.price >= (this.user.balance - this.selectedValue)
        })
      } else {
        items.forEach(i => {
          this.$set(i, 'disabled', false)
        })
      }

      if (this.search === '') return items
      return items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
    },
    //
    canNext() {
      if (!this.selected.length) return false
      if (this.user.balance < this.selectedValue) return false
      return true
    },
    canWithdraw() {
      if (!this.canNext) return false
      if (this.editing) return false
      if (!this.tradeurl) return false
      return true
    }
  },
  methods: {
    ...mapActions({
      getUser: 'user/getAuth'
    }),
    ...mapMutations({
      setBalance: 'user/setBalance'
    }),
    // inventory
    selectItem(item) {
      if (this.loading.inventory) return
      if (this.loading.withdraw) return

      // eslint-disable-next-line no-param-reassign
      item.selected = !item.selected
    },
    selectAll() {
      if (this.loading.inventory) return
      if (this.loading.withdraw) return

      const selected = this.allSelected

      this.items.forEach(i => {
        i.selected = !selected
      })
    },
    // withdraw
    async cashout() {
      if (this.loading.withdraw) return
      this.loading.withdraw = true

      try {
        const { balance, itemsFailed, approval } = await api.store.csgoBuy(this.selected.map(i => i._id))
        this.setBalance(balance)

        if (approval) {
          this.$toast.open({ type: 'info', text: 'Your cashout needs to be manually approved. You\'ll be notified once it is.' })
        } else {
          this.$modal.open('tradeSummary', { maxWidth: 400 }, {
            items: this.selected.map(i => ({
              ...i,
              failed: itemsFailed.includes(i._id)
            }))
          })
        }

        this.close()
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.withdraw = false
      }
    },
    // misc
    async refreshBalance() {
      if (this.loading.balance) return
      this.loading.balance = true

      try {
        await this.getUser()
      } catch {} finally {
        this.loading.balance = false
      }
    },
    async refreshInventory() {
      if (this.loading.inventory) return
      this.loading.inventory = true

      try {
        const items = await api.store.csgo()
        this.items = sortBy(items.map(i => ({ ...i, selected: false })), 'price').reverse()
      } catch {} finally {
        this.loading.inventory = false
      }
    },
    async setTradeURL() {
      if (!this.tradeurl) return
      if (this.loading.tradeurl) return
      this.loading.tradeurl = true

      try {
        const test = await api.user.setTradeUrl(this.tradeurl)
        console.log(test)

        this.user.steamTrade.url = this.tradeurl
        this.editing = false

        this.$toast.open({ type: 'success', text: 'Your Trade URL has been saved' })
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.tradeurl = false
      }
    }
  },
  created() {
    this.refreshInventory()
    this.refreshBalance()

    this.tradeurl = this.user.steamTrade ? this.user.steamTrade.url : ''
    if (!this.tradeurl) this.editing = true
  }
}
