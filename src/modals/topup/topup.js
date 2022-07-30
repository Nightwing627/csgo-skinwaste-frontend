import { mapActions, mapGetters } from 'vuex'
import { sleep } from '@/utils'
import { COINS, COIN_ICONS, COIN_COLORS } from '@/utils/constants'

export default {
  needsAuth: true,
  name: 'ModalTopUp',
  props: ['close', 'options'],
  data() {
    return {
      loading: false,
      //
      step: 1,
      selectedCurrency: null,
      csgo: false,
      //
      localRefCode: null,
      settingCode: false,
      //
      copied: false,
      conversion: {
        coins: 5,
        crypto: null
      }
    }
  },
  metaInfo: {
    title: 'Top up balance'
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
          rate: this.config.crypto.rates[currency].deposit,
          minDeposit: this.config.crypto.minDepositValues[currency]
        }
        return acc
      }, {})
    },
    currency() {
      if (!this.selectedCurrency) return null
      return this.currencies[this.selectedCurrency]
    },
    address() {
      if (!this.user) return null
      if (!this.currency) return null
      return this.user.cryptoAddresses[this.currency.code]
    }
  },
  created() {
    this.localRefCode = this.user.affiliateCodeUsed
  },
  methods: {
    ...mapActions({
      getUser: 'user/getAuth',
      getInventory: 'user/getInventory',
      getAddress: 'user/getCryptoAddress',
      useRefCode: 'user/useAffiliateCode'
    }),
    async copy() {
      if (!navigator.clipboard) {
        this.$toast.open({ type: 'error', text: 'Your browser doesn\'t support this feature.' })
        return
      }

      try {
        await navigator.clipboard.writeText(this.address)

        this.copied = true
        await sleep(1e3)
        this.copied = false
      } catch (err) {
        console.error('Failed to copy!', err)
        this.$toast.open({ type: 'error', text: 'Couldn\'t copy, sorry.' })
      }
    },
    async refreshBalance() {
      if (this.loading) return
      this.loading = true

      await this.getUser()

      this.loading = false
    },
    updateCoinsAmount() {
      if (!this.currency) return
      const rate = Math.round(this.currency.rate / 100)

      const num = rate * this.conversion.crypto
      const refBonus = this.config.affiliate.referralDepositBonus
      const bonus = this.user.affiliateCodeUsed ? num * refBonus : 0

      if (Number.isNaN(num)) this.conversion.coins = ''
      else this.conversion.coins = (num + bonus).toFixed(2)
    },
    updateCryptoAmount() {
      if (!this.currency) return
      const coins = Math.round(this.conversion.coins * 100)

      const num = coins / this.currency.rate
      const refBonus = this.config.affiliate.referralDepositBonus
      const bonus = this.user.affiliateCodeUsed ? num * refBonus : 0

      if (Number.isNaN(num)) this.conversion.crypto = ''
      else this.conversion.crypto = (num - bonus).toFixed(10)
    },
    async select(val) {
      if (!this.config.crypto.allowedCoins.includes(val.toUpperCase())) return

      this.selectedCurrency = val
      this.conversion.coins = 5
      this.updateCryptoAmount()

      // get user crypto address if not in user object
      const currency = this.currencies[val]
      this.getAddress(currency.code)

      // animate to next step automatically
      if (this.step === 1) {
        await sleep(250)
        this.step += 1
      }
    },
    async useCode() {
      if (!this.localRefCode) return
      if (this.settingCode) return
      this.settingCode = true

      try {
        await this.useRefCode(this.localRefCode)
        this.$toast.open({ type: 'success', text: 'Redeemed referral code.' })
      } catch {} finally {
        this.settingCode = false
      }
    }
  }
}
