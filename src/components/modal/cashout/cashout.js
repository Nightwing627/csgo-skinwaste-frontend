import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortBy from 'lodash.sortby'
import { COINS, COIN_ICONS, COIN_COLORS } from '@/utils/constants'
import { payments as api } from '@/api'
import { errorToast } from '@/utils'
import Inventory from '@/components/Inventory'


export default {
  needsAuth: true,
  name: 'ModalCashOut',
  props: ['close', 'options'],
  components: {
    Inventory
  },
  data() {
    return {
      step: 1,
      loading: {
        balance: false,
        withdraw: false,
        inventory: false
      },
      // inv
      items: [],
      search: '',
      // withdraw
      selectedCurrency: 'ETH',
      address: null,
      saveAddress: false
    }
  },
  metaInfo: {
    title: 'Cash out'
  },
  watch: {
    loading: {
      handler(val) {
        this.$emit('update:options', { ...this.options, persistent: Object.values(val).some(i => i) })
      },
      deep: true
    },
    saveAddress(val) {
      this.$ls.set('saveWithdrawAddress', val)
    },
    selectedCurrency(val) {
      if (this.$ls.get('saveWithdrawAddress')) {
        this.address = this.$ls.get(`withdrawAddress_${val}`, null)
      } else {
        this.address = null
      }
    },
    inventory: {
      handler(val) {
        this.items = sortBy(val.map(i => ({ ...i, selected: false })), 'price').reverse()
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
      user: 'user/getUser',
      inventory: 'user/inventory'
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
      if (this.search === '') return this.items
      return this.items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
    },

    // withdraw
    currencies() {
      return this.config.crypto.allowedCoins.reduce((acc, currency) => {
        acc[currency] = {
          id: currency,
          code: currency,
          name: COINS[currency],
          icon: COIN_ICONS[currency],
          color: COIN_COLORS[currency],
          rate: this.config.crypto.rates[currency].withdrawal
        }
        return acc
      }, {})
    },
    currency() {
      if (!this.selectedCurrency) return null
      return this.currencies[this.selectedCurrency]
    },
    cryptoAmount() {
      if (!this.currency) return 0
      const num = this.selectedValue / this.currency.rate

      if (Number.isNaN(num)) return null
      return num.toFixed(10)
    },
    //
    canNext() {
      if (!this.selected.length) return false
      if (this.selectedValue < this.config.crypto.minWithdrawalAmount) return false
      return true
    },
    canWithdraw() {
      if (!this.canNext) return false
      if (!this.address) return false
      if (!this.currency) return false
      return true
    }
  },
  methods: {
    ...mapActions({
      getUser: 'user/getAuth',
      getInventory: 'user/getInventory'
    }),
    ...mapMutations({
      setBalance: 'user/setBalance',
      removeItems: 'user/removeItems'
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
        const { address } = this
        const currency = this.currency.code.toLowerCase()
        const backpackIds = this.selected.map(i => i.backpackId)

        await api.withdraw({ items: backpackIds, address, currency })

        if (this.saveAddress) {
          this.$ls.set(`withdrawAddress_${currency}`, address)
        } else {
          this.$ls.remove(`withdrawAddress_${currency}`)
        }

        this.$toast.open({ type: 'success', text: 'Withdrawal in progress. You\'ll be notified once completed. ' })
        this.removeItems(backpackIds)

        this.close()
      } catch (e) {
        console.error(e)
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
        await this.getInventory()
      } catch {} finally {
        this.loading.inventory = false
      }
    }
  },
  created() {
    this.refreshInventory()

    this.saveAddress = this.$ls.get('saveWithdrawAddress', false)
    if (this.saveAddress) {
      this.address = this.$ls.get(`withdrawAddress_${this.currency.code}`, null)
    }
  }
}
