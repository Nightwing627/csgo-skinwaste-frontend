import { mapActions, mapGetters } from 'vuex'
import UserLevel from '@/components/UserLevel'

import BetHistory from '@/components/BetHistory.vue'


export default {
  needsAuth: true,
  name: 'ModalAccount',
  props: ['close', 'options'],
  components: {
    UserLevel,
    BetHistory
  },
  metaInfo: {
    title: 'Account'
  },
  data() {
    return {
      loading: false,
      tab: 0,
      transactionValue: [0, 1],
      transactionTypes: [
        {text:"Withdraw",value: 0},
        {text:"Deposit",value: 1},
        {text:"Jackpot",value: 2},
        {text:"Coinflip",value: 3},        
        {text:"Winnings",value: 4},
        {text:"Sponsor",value: 5},
        {text:"Cashout",value: 6},
        {text:"Operations",value: 7},
        {text:"Item Purchase",value: 8},
        {text:"Item Sale",value: 9},
        {text:"Affiliate Deposit",value: 10},
        {text:"Affiliate Withdrawal",value: 11},
        {text:"Giveaway",value: 12},
        {text:"Rake",value: 13},
        {text:"Affiliate Elite Deposit",value: 14},
        {text:"Tip",value: 15},
        {text:"CSGO Profit",value: 16},
        {text:"CSGO Purchase",value: 17},
        {text:"CSGO Refund",value: 18},
        {text:"Crypto Profit",value: 19},
        {text:"Roulette",value: 20},
        {text:"Catcher",value: 21},
        {text:"Edit User Balance",value: 21},
        {text:"Leaderboard Rewards",value: 22},
        {text:"Coin Party Rewards",value: 23},
        {text:"Reward",value: 24}
      ],
      betTypes: [
        { text: 'Jackpot: Normal', value: 'elite' },
        { text: 'Jackpot: 10 Max', value: 'silver' },
        { text: 'Coinflip', value: 'coinflip' },
        { text: 'Roulette', value: 'roulette' }
      ],
      betValue: 'elite'
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      betHistory: 'user/betHistory',
      betHistoryGames: 'user/betHistoryGames',
      paymentHistory: 'user/paymentHistory'
    }),
    profitWagered() {
      return this.user.won - this.user.wagered
    },
    profitDeposited() {
      return this.user.won - this.user.deposited
    }
  },
  watch: {
    tab(val) {
      if (val === 1 && this.betHistory === undefined) this.getBetHistory(this.betValue)
      if (val === 2 && this.paymentHistory === undefined) this.getPaymentHistory(this.transactionValue)
    }
  },
  created() {

  },
  methods: {
    ...mapActions({
      getUser: 'user/getAuth',
      getBetHistory: 'user/getBetHistory',
      getPaymentHistory: 'user/getPaymentHistory'
    }),
    async transactionSelect(value) {
      if (this.loading) return
      this.loading = true
      try {
        this.transactionValue = value
        if (this.transactionValue.length) await this.getPaymentHistory(value)
      } catch (e) {
        // console.log(e)
      } finally {
        this.loading = false
      }
    },
    async betSelect(value) {
      if (this.loading) return
      this.loading = true
      try {
        await this.getUser()
        this.betValue = value
        await this.getBetHistory(value)
      } catch (e) {
        // console.log(e)
      } finally {
        this.loading = false
      }
    },
    async refreshStats() {
      if (this.loading) return
      this.loading = true

      try {
        await this.getUser()

        if (this.tab === 1) await this.getBetHistory(this.betValue)
        if (this.tab === 2) await this.getPaymentHistory(this.transactionValue)
      } catch (e) {
        // console.log(e)
      } finally {
        this.loading = false
      }
    },
    getNeededWager() {
      // eslint-disable-next-line no-plusplus
      const exp = this.user.wagered
      const x = 25.93
      const y = -263.8
      const z = Math.exp((1 - y) / x)
      return exp / z
      // return Math.ceil((exp * (Math.ceil(x * Math.log(exp + z) + y) - ((x * Math.log(exp + z) + y) - 1))))
    }
  }
}
