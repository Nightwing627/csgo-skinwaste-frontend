import { mapGetters, mapMutations, mapActions } from 'vuex'
import sortBy from 'lodash.sortby'
import { gsap } from 'gsap'
import { dragscroll } from 'vue-dragscroll'


import { play as playSound } from '@/modules/sounds'
import { JACKPOT_COLORS } from '@/utils/constants'

export default {
  name: 'ViewJackpot',
  directives: {
    dragscroll
  },
  components: {
    Item: () => import('@/components/Item'),
    JackpotTimer: () => import('@/components/jackpot/Timer.vue'),
    UserLevel: () => import('@/components/UserLevel.vue'),
    RoundInfo: () => import('@/components/jackpot/RoundInfo.vue')
  },
  data() {
    return {
      game: 'elite',
      tickers: {
        potValues: { silver: 0, elite: 0 },
        potValue: 0,
        potItems: 0
      },
      timer: 0,
      handlers: {},
      // roll logic
      rollClones: 1,
      rolling: false,
      showWinner: false,
      rollHandlers: {}
    }
  },
  metaInfo() {
    return {
      title: this.pageTitle
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      config: 'config',
      pots: 'jackpot/pots',
      pot: 'jackpot/pot',
      status: 'jackpot/status',
      bets: 'jackpot/bets',
      playerData: 'jackpot/players',
      rollingAt: 'jackpot/rollingAt',
      pf: 'jackpot/pf',
      roundId: 'jackpot/roundId',
      items: 'jackpot/items',
      currentPot: 'jackpot/currentPot',
      history: 'jackpot/history',
      focused: 'windowFocused'
    }),
    pageTitle() {
      if (this.potValue) {
        const formattedValue = this.$options.filters.currencyInt(this.potValue)
        return `${formattedValue} ${this.currentPot.toUpperCase()} Pot`
      }
      return `${this.currentPot.toUpperCase()} Pot`
    },
    potsValues() {
      if (!this.pots.elite || !this.pots.silver) return {}

      return {
        elite: this.pots.elite.bets
          .map(i => i.amount)
          .reduce((acc, v) => acc + v, 0),
        silver: this.pots.silver.bets
          .map(i => i.amount)
          .reduce((acc, v) => acc + v, 0)
      }
    },
    potConfig() {
      return this.config.jackpot[this.currentPot]
    },
    potValue() {
      if (!this.bets.length) return 0
      return this.bets.map(i => i.amount).reduce((acc, v) => acc + v, 0)
    },
    rollWidth() {
      if (this.rolling) return 100

      return (this.items.length / this.potConfig.maxItems) * 100
    },
    winChance() {
      if (!this.user) return 0
      if (!this.playerData[this.user._id]) return 0

      const myTotal = this.bets
        .filter(i => i.userId === this.user._id)
        .map(i => i.amount)
        .reduce((acc, v) => acc + v, 0)

      return (myTotal / this.potValue) * 100
    },
    players() {
      const unique = this.bets
        .map(v => v.userId)
        .map((v, i, final) => final.indexOf(v) === i && i)
        .filter(i => this.bets[i])
        .map(i => this.bets[i])
        .map((bet, i) => ({
          ...this.playerData[bet.userId],
          color: JACKPOT_COLORS[i % JACKPOT_COLORS.length]
        }))

      return unique.reduce((acc, player) => {
        acc[player.id] = player
        return acc
      }, {})
    },
    winner() {
      if (!this.pf.winnerId) return false
      const player = this.players[this.pf.winnerId]

      player.totalBet = this.bets
        .filter(i => i.userId === player.id)
        .map(i => i.amount)
        .reduce((acc, v) => acc + v, 0)

      player.winChance = (player.totalBet / this.potValue) * 100

      return player
    },
    sortedItems() {
      return sortBy(this.items, 'price').reverse()
    },
    pastGames() {
      const history = [...this.history]
      if (history.length > 3) history.length = 3

      return history.map(game => {
        const {
          id, pf, roundId, bets
        } = game
        const players = this.getHistoryPlayers(bets, game.players)
        const potValue = game.bets
          .map(i => i.amount)
          .reduce((acc, v) => acc + v, 0)
        const winner = players[game.pf.winnerId]

        if (winner) {
          winner.totalBet = winner.bets
            .map(i => i.amount)
            .reduce((acc, v) => acc + v, 0)

          winner.winChance = (winner.totalBet / potValue) * 100
        }

        // BUG kekw
        if (!winner) {
          console.log(players)
          this.$bugsnag.notify(new Error('bet history error'), {
            metaData: { players, game }
          })
        }

        return {
          roundId,
          id,
          pf,
          bets,
          players,
          winner,
          potValue
        }
      })
    },
    timerValue() {
      return Math.round((100 * this.timer) / this.potConfig.roundTimeLimit)
    }
  },
  watch: {
    potsValues: {
      handler(vals) {
        Object.entries(vals).forEach(([pot, val]) => {
          gsap.to(this.$data.tickers.potValues, 0.5, { [pot]: val })
        })
      },
      immediate: true
    },
    potValue: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { potValue: val })
      },
      immediate: true
    },
    items: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { potItems: val.length })
      },
      immediate: true
    },
    pf: {
      handler(val) {
        if (val && val.winnerId) this.roll()
      },
      deep: true,
      immediate: true
    },
    status(val) {
      if (this.rolling && val !== 'rolling') {
        this.resetRolling()
      }
    },
    rollingAt: {
      handler(val) {
        this.initTimer(val)
      },
      immediate: true
    }
  },
  created() {
    if (!this.pots.elite || !this.pots.silver) this.getPots()
  },
  methods: {
    ...mapActions({
      getPots: 'jackpot/get'
    }),
    ...mapMutations({
      setCurrent: 'jackpot/setCurrent'
    }),
    setGame(val) {
      this.game = val
      this.setCurrent(val)
    },
    initTimer(val) {
      if (!val) return
      if (this.handlers.timer) clearInterval(this.handlers.timer)

      this.timer = Math.round((val - Date.now()) / 1000)
      if (this.timer <= 0) return

      this.handlers.timer = setInterval(() => {
        this.timer = Math.round((val - Date.now()) / 1000)
        if (this.timer <= 0) clearInterval(this.handlers.timer)
      }, 1e3)
    },
    roll() {
      if (this.rolling) return
      if (!this.pf) return
      this.rolling = true

      const timeSinceRoll = this.rollingAt - Date.now()
      const rollDuration = timeSinceRoll
        + this.config.jackpot[this.currentPot].animationTime * 1000

      if (rollDuration < 2e3) {
        this.showWinner = true
        return
      }

      // wait for rollWidth animation
      this.rollHandlers.shortWait = setTimeout(() => {
        this.rollClones = 12
        const rollPercent = 10 * 100 - 50 + this.pf.ticket * 100

        console.log(rollPercent)
        playSound('roll')

        const el = this.$refs.rollSlider
        el.style.transitionDuration = `${rollDuration}ms`
        el.style.transform = `translateX(-${rollPercent}%)`

        this.rollHandlers.rollAnim = setTimeout(() => {
          this.showWinner = true
        }, rollDuration)
      }, 800)
    },
    resetRolling() {
      const el = this.$refs.rollSlider
      el.style.transitionDuration = ''
      el.style.transform = ''

      this.rolling = false
      this.rollClones = 1
      this.showWinner = false
      Object.values(this.rollHandlers).forEach(i => clearTimeout(i))
    },
    getHistoryPlayers(bets, players) {
      return bets
        .map(v => v.userId)
        .map((v, i, final) => final.indexOf(v) === i && i)
        .filter(i => bets[i])
        .map(i => bets[i])
        .map((bet, index) => {
          const playerBets = bets.filter(i => i.userId === bet.userId)
          const items = playerBets.reduce((acc, i) => [...acc, ...i.items], [])

          return {
            ...players[bet.userId],
            bets: playerBets,
            items,
            color: JACKPOT_COLORS[index % JACKPOT_COLORS.length]
          }
        })
        .reduce((acc, player) => {
          acc[player.id] = player
          return acc
        }, {})
    },
    tweet(name, total, winChance) {
      // `https://twitter.com/intent/tweet?text=Test%20my%20asshole%0Ahttp%3A%2F%2Flocalhost%3A8080%2F%23%2Freplay%2F517199&source=webclient`

      const coins = this.$options.filters.currencyInt(total)
      const text = encodeURIComponent(
        `${name} won ${
          this.currentPot
        } pot valued at ${coins} coins with ${winChance.toFixed(3)}% #SKINWASTE`
      )

      const url = `https://twitter.com/intent/tweet?text=${text}`
      window.open(
        url,
        '_blank',
        'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
      )
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.rolling) this.resetRolling()
    Object.values(this.handlers).forEach(i => clearInterval(i))
    next()
  },
  beforeDestroy() {
    if (this.rolling) this.resetRolling()
    Object.values(this.handlers).forEach(i => clearInterval(i))
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { name } = to
      vm.setCurrent(name.replace('jackpot-', ''))
    })
  }
}
