import { mapActions, mapGetters, mapMutations } from 'vuex'
import { COINS, COIN_ICONS, COIN_COLORS } from '@/utils/constants'
import { payments as api } from '@/api'
import { errorToast } from '@/utils'

export default {
  needsAuth: true,
  name: 'ModalCashOut',
  props: ['close', 'options'],
  data() {
    return {
      loading: {
        balance: false,
        withdraw: false
      },
      //
      selectedCurrency: 'ETH',
      amount: 1,
      address: null,
      saveAddress: false,
      gasFee: 0
    }
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
    amount: {
      handler(val) {
        console.debug('amount changed', val)
        this.amount = val < 0 ? 0 : val
      }
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    }),
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
      const coins = Math.round(this.amount * 100)

      const num = coins / this.currency.rate
      if (Number.isNaN(num)) return null
      return num.toFixed(10)
    },
    canWithdraw() {
      if (!this.amount) return false
      if (!this.address) return false
      if (!this.currency) return false
      if (this.amount * 100 > this.user.balance) return false
      if (this.amount * 100 < this.config.crypto.minWithdrawalAmount) return false
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
    async cashout() {
      if (this.loading.withdraw) return
      this.loading.withdraw = true

      try {
        const { address } = this
        const currency = this.currency.code
        const amount = Math.round(this.amount * 100)

        const { balance, approval } = await api.withdraw({ amount, address, currency })
        this.setBalance(balance)

        if (approval) {
          this.$toast.open({ type: 'info', text: 'Your cashout needs to be manually approved. You\'ll be notified once it is.' })
        } else {
          this.$toast.open({ type: 'success', text: 'Withdrawal in progress. You\'ll be notified once completed.' })
        }

        if (this.saveAddress) {
          this.$ls.set(`withdrawAddress_${currency}`, address)
        } else {
          this.$ls.remove(`withdrawAddress_${currency}`)
        }

        this.close()
      } catch (e) {
        console.log(e)
        errorToast(e)
      } finally {
        this.loading.withdraw = false
      }
    },
    async refreshBalance() {
      if (this.loading.balance) return
      this.loading.balance = true

      await this.getUser()

      this.loading.balance = false

      await this.getGasFee()
    },
    async getGasFee() {
      try {
        const gasFee = await api.gasFee(this.address, this.amount)
        this.gasFee = gasFee
      } catch (e) {
        // console.log(e)
        // errorToast(e)
      }
    }
  },
  created() {
    this.refreshBalance()

    this.saveAddress = this.$ls.get('saveWithdrawAddress', false)
    if (this.saveAddress) {
      this.address = this.$ls.get(`withdrawAddress_${this.currency.code}`, null)
    }
  }
}
