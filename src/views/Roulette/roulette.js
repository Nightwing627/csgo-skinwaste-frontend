/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
import { mapGetters, mapActions } from 'vuex'
import { play as playSound } from '@/modules/sounds'

const timer = ms => new Promise(res => setTimeout(res, ms))

export default {
  name: 'ViewRoulette',
  components: {},
  data() {
    return {
      game: 'roulette',
      rouletteMultipliers: ['2x', '3x', '5x', '30x'],
      rouletteFields: ['black', 'purple', 'pink', 'gold'],
      betAmount: '0.00',
      bets: {
        '2x': {
          bets: [],
          total: 0
        },
        '3x': {
          bets: [],
          total: 0
        },
        '5x': {
          bets: [],
          total: 0
        },
        '30x': {
          bets: [],
          total: 0
        }
      },
      endTime: 0,
      now: 0,
      wheel: null,
      winning: null,
      history: [],
      order: [
        0,
        4,
        24,
        12,
        25,
        13,
        26,
        14,
        27,
        5,
        28,
        6,
        29,
        15,
        30,
        16,
        31,
        7,
        17,
        8,
        18,
        1,
        19,
        2,
        20,
        9,
        21,
        10,
        22,
        11,
        23,
        3
      ],
      card_width: 80,
      card_margin: 2,
      rows: 6,
      card: 80 + 2 * 2, // card_width + card_margin * 2
      progress: null,
      progress_bar: null,
      previousBets: [],
      repeatBets: false,
      last_rolls: [{
        color: '2x',
        amount: 0
      },
      {
        color: '3x',
        amount: 0
      },
      {
        color: '5x',
        amount: 0
      },
      {
        color: '30x',
        amount: 0
      }]
    }
  },
  metaInfo() {
    return {
      title: 'Roulette'
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      config: 'config'
    })
  },
  async mounted() {
    this.wheel = document.getElementById('roulette-container')
    this.progress = document.getElementById('roulette-progress')
    this.progress_bar = document.getElementById('roulette-progress-bar')
    for (let i = 0; i < 28; i++) {
      const row = this.wheel.firstElementChild.cloneNode(true)
      this.wheel.appendChild(row)
    }

    await this.getRoulette()

    this.endTime = this.$store.state.roulette.roulette.endTime

    const diff = (this.endTime - Date.now()) / 1000

    if (diff <= 0) {
      const hash = `${this.$store.state.roulette.rollingRoulette.unencodedServerHash}-${this.$store.state.roulette.rollingRoulette.randomHash}`
      const result = parseInt(hash.substr(0, 52 / 4), 16) % 32
      const position = this.order.indexOf(result)
      let landingPosition = this.rows * this.order.length * this.card
        + position * this.card
        - this.card / 2

      const randomize = Math.floor(
        Math.random()
          * (Math.round(Math.random()) ? 1 : -1)
          * this.card_width
          * 0.5
      )

      landingPosition += randomize

      this.wheel.style.transitionTimingFunction = 'cubic-bezier(.16,.8,.05,1)'
      this.wheel.style.transitionDuration = `${this.config.roulette
        .animationTime
        - 1
        + diff || 8 - 1 + diff}s`
      this.wheel.style.transform = `translateX(-${landingPosition}px)`
      setTimeout(() => {
        const resetTo = -(position * this.card + randomize - this.card / 2)
        this.wheel.style.transitionTimingFunction = ''
        this.wheel.style.transitionDuration = ''
        this.wheel.style.transform = `translateX(${resetTo}px)`
        if (result === 0) {
          this.winning = '30x'
          playSound('roulette_gold', { volume: 0.3 })
        } else if (result <= 6) {
          this.winning = '5x'
        } else if (result <= 16) {
          this.winning = '3x'
        } else if (result <= 32) {
          this.winning = '2x'
        }
        if (
          this.bets[this.winning].bets.some(bet => bet.userId === this.user.id)
        ) {
          playSound('roulette_win', { volume: 0.3 })
        }
      }, (this.config.roulette.animationTime - 1 + diff || 8 - 1 + diff) * 1000)
    } else {
      this.progress_bar.style.transitionTimingFunction = ''
      this.progress_bar.style.transitionDuration = ''
      this.progress_bar.style.width = `${parseFloat(
        (diff / this.config.roulette.roundTimeLimit) * 100
      ).toFixed(2)}%`

      setTimeout(() => {
        this.progress_bar.style.transitionTimingFunction = 'linear'
        this.progress_bar.style.transitionDuration = `${diff}s`
        this.progress_bar.style.width = '0%'
      }, 10)
    }

    if (this.history.length > 0) {
      this.last_rolls[0].amount = 0
      this.last_rolls[1].amount = 0
      this.last_rolls[2].amount = 0
      this.last_rolls[3].amount = 0
      for (let i = 0; i < this.history.length; i++) {
        switch (this.history[i].roll) {
          case 'black':
            this.last_rolls[0].amount++
            break
          case 'purple':
            this.last_rolls[1].amount++
            break
          case 'pink':
            this.last_rolls[2].amount++
            break
          case 'gold':
            this.last_rolls[3].amount++
            break
          default:
            break
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getRoulette: 'roulette/get',
      bet: 'roulette/bet',
      getUser: 'user/getAuth'
    }),
    async placeBet(field) {
      const bet = parseInt(this.betAmount * 100, 10)
      await this.bet({ field, bet })
      await this.getUser()

      if (!this.previousBets.some(_bet => _bet.field === field && _bet.amount === bet)) {
        this.previousBets.push({ field, amount: bet })
        if (this.previousBets.length > 3) {
          this.previousBets.shift()
        }
      }
    },
    async placeBetViaPrevButton({ amount, field }) {
      await this.bet({ field, bet: amount })
      await this.getUser()
    },
    async placeRepeatBets() {
      await timer(3000)
      for (let i = 0; i < this.previousBets.length; i++) {
        const { field, amount: bet } = this.previousBets[i]
        await this.bet({ field, bet })
        await this.getUser()
        await timer(1000)
      }
    },
    copy() {
      navigator.clipboard.writeText(
        this.$store.state.roulette.roulette.gameHash
      )
    },
    clear() {
      this.betAmount = '0.00'
    },
    add(number) {
      this.betAmount = parseFloat(
        parseFloat(this.betAmount || 0) + parseFloat(number)
      ).toFixed(2)
    },
    half() {
      this.betAmount = parseFloat(this.betAmount / 2).toFixed(2)
    },
    double() {
      this.betAmount = parseFloat(this.betAmount * 2).toFixed(2)
    },
    max() {
      this.betAmount = parseFloat(this.user.balance / 100).toFixed(2)
    },
    spinWheel() {
      const hash = `${this.$store.state.roulette.rollingRoulette.unencodedServerHash}-${this.$store.state.roulette.rollingRoulette.randomHash}`
      const result = parseInt(hash.substr(0, 52 / 4), 16) % 32
      const position = this.order.indexOf(result)
      let landingPosition = this.rows * this.order.length * this.card
        + position * this.card
        - this.card / 2

      const randomize = Math.floor(
        Math.random()
          * (Math.round(Math.random()) ? 1 : -1)
          * this.card_width
          * 0.5
      )

      landingPosition += randomize

      this.wheel.style.transitionTimingFunction = 'cubic-bezier(.16,.8,.05,1)'
      this.wheel.style.transitionDuration = `${this.config.roulette
        .animationTime - 1 || 8 - 1}s`
      this.wheel.style.transform = `translateX(-${landingPosition}px)`

      setTimeout(() => {
        const resetTo = -(position * this.card + randomize - this.card / 2)
        this.wheel.style.transitionTimingFunction = ''
        this.wheel.style.transitionDuration = ''
        this.wheel.style.transform = `translateX(${resetTo}px)`
        if (result === 0) {
          this.winning = '30x'
          playSound('roulette_gold', { volume: 0.3 })
        } else if (result <= 6) {
          this.winning = '5x'
        } else if (result <= 16) {
          this.winning = '3x'
        } else if (result <= 32) {
          this.winning = '2x'
        }
        if (
          this.bets[this.winning].bets.some(bet => bet.userId === this.user.id)
        ) {
          playSound('roulette_win', { volume: 0.3 })

          if (this.repeatBets) { this.placeRepeatBets() } else { this.previousBets = [] }
        }
      }, (this.config.roulette.animationTime - 1 || 8 - 1) * 1000)
    },
    countDecimals(value) {
      if (value % 1 !== 0) return value.toString().split('.')[1].length
      return 0
    }
  },
  watch: {
    betAmount(val) {
      if (val < 0) this.betAmount = '0.00'
      if (this.countDecimals(val) > 2) {
        this.betAmount = parseFloat(val).toFixed(2)
      }
    },
    '$store.state.roulette.history': function (val) {
      if (val.length > 0) {
        this.last_rolls[0].amount = 0
        this.last_rolls[1].amount = 0
        this.last_rolls[2].amount = 0
        this.last_rolls[3].amount = 0
        for (let i = 0; i < val.length; i++) {
          switch (val[i].roll) {
            case 'black':
              this.last_rolls[0].amount++
              break
            case 'purple':
              this.last_rolls[1].amount++
              break
            case 'pink':
              this.last_rolls[2].amount++
              break
            case 'gold':
              this.last_rolls[3].amount++
              break
            default:
              break
          }
        }
        this.history = val // .slice(0, 20)
      }
    },
    '$store.state.roulette.status': async function (val) {
      if (val === 'open') {
        this.progress_bar.style.transitionTimingFunction = ''
        this.progress_bar.style.transitionDuration = ''
        this.progress_bar.style.width = '100%'
        this.winning = null

        await this.getUser()
        setTimeout(() => {
          this.progress_bar.style.transitionTimingFunction = 'linear'
          this.progress_bar.style.transitionDuration = `${this.config.roulette
            .roundTimeLimit || 15}s`
          this.progress_bar.style.width = '0%'
        }, 10)
      } else if (val === 'rolling') {
        this.winning = null
        this.spinWheel()
        playSound('roulette_spin', { volume: 0.3 })
      }
    },
    '$store.state.roulette.bets': function (val) {
      this.bets = {
        '2x': {
          bets: [],
          total: 0
        },
        '3x': {
          bets: [],
          total: 0
        },
        '5x': {
          bets: [],
          total: 0
        },
        '30x': {
          bets: [],
          total: 0
        }
      }

      if (!val || val.length <= 0) return

      for (let i = 0; i < val.length; i++) {
        const bet = val[i]
        switch (bet.field) {
          case 'black':
            this.bets['2x'].bets.push(bet)
            this.bets['2x'].total += bet.amount
            break
          case 'purple':
            this.bets['3x'].bets.push(bet)
            this.bets['3x'].total += bet.amount
            break
          case 'pink':
            this.bets['5x'].bets.push(bet)
            this.bets['5x'].total += bet.amount
            break
          case 'gold':
            this.bets['30x'].bets.push(bet)
            this.bets['30x'].total += bet.amount
            break
          default:
            break
        }
      }
      for (const [key, value] of Object.entries(this.bets)) {
        this.bets[key].bets = value.bets.sort((a, b) => a.amount - b.amount)
      }
    }
  }
}
