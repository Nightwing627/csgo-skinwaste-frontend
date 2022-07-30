import { mapGetters, mapActions } from 'vuex'
import sortBy from 'lodash.sortby'
import { gsap } from 'gsap'

import Item from '@/components/Item'
import UserLevel from '@/components/UserLevel.vue'

export default {
  name: 'ViewCoinflip',
  components: {
    Item,
    UserLevel
  },
  data() {
    return {
      tickers: {
        count: 0,
        joinable: 0,
        value: 0,
        ownTotal: 0
      },
      hideCompleted: false,
      currentUnix: 0,
      handlers: {}
    }
  },
  metaInfo: {
    title: 'Coinflips'
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      config: 'config',
      games: 'coinflip/games'
    }),
    sortedGames() {
      if (!this.games) return []

      let games = this.games.map(i => ({
        ...i,
        items: this.gameItems(i),
        own: this.isOwn(i)
      }))

      if (this.hideCompleted) {
        games = games.filter(i => {
          if (i.rolledAt) return i.rolledAt + 10e3 > Date.now()
          return i.state < 2
        })
      }

      if (this.ownTotal) {
        games = sortBy(games, i => {
          let oneSidePrice = 0
          if (i.t) oneSidePrice = i.t.amount
          if (i.ct && !oneSidePrice) oneSidePrice = i.ct.amount

          if (i.own) return 99999e2 + oneSidePrice
          return oneSidePrice
        }).reverse()
      } else {
        games = sortBy(games, 'total').reverse()
      }

      return games
    },
    lastOwnedId() {
      if (!this.sortedGames.find(i => i.own)) return false
      return this.sortedGames.slice().reverse().find(i => i.own).id
    },
    count() {
      if (!this.games) return 0
      return this.games.length
    },
    totalValue() {
      if (!this.games) return 0
      return this.games.reduce((acc, i) => acc + i.total, 0)
    },
    joinable() {
      if (!this.games) return 0
      if (this.user) {
        return this.games.filter(i => i.state === 0 && i.creator !== this.user._id).length
      }
      return this.games.filter(i => i.state === 0).length
    },
    ownTotal() {
      if (!this.games) return 0
      if (!this.user) return 0

      return this.games.filter(game => {
        if (game.ct && game.ct.user._id === this.user._id) return true
        if (game.t && game.t.user._id === this.user._id) return true
        return false
      }).reduce((acc, i) => acc + i.total, 0)
    }
  },
  watch: {
    count: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { count: val })
      },
      immediate: true
    },
    joinable: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { joinable: val })
      },
      immediate: true
    },
    totalValue: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { value: val })
      },
      immediate: true
    },
    ownTotal: {
      handler(val) {
        gsap.to(this.$data.tickers, 1, { ownTotal: val })
      },
      immediate: true
    },
    hideCompleted(val) {
      this.$ls.set('hideCompletedCoinflips', val)
    }
    // items: {
    //   handler(val) {
    //     gsap.to(this.$data.tickers, 1, { potItems: val.length })
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    if (!this.games) this.getCoinflips()
    if (this.handlers.timer) clearInterval(this.handlers.timer)
    this.currentUnix = Date.now()

    this.handlers.timer = setInterval(() => {
      this.currentUnix = Date.now() // dont ++, setInterval is unreliable
    }, 1e3)

    this.hideCompleted = this.$ls.get('hideCompletedCoinflips', false)
  },
  methods: {
    ...mapActions({
      getCoinflips: 'coinflip/get'
    }),
    gameItems(game) {
      let items = []
      if (game.t) {
        items = [...game.t.items]
      }

      if (game.ct) {
        items = [...items, ...game.ct.items]
      }

      return sortBy(items, 'price').reverse()
    },
    isOwn(game) {
      if (!this.user) return false
      if (game.ct && game.ct.user._id === this.user._id) return true
      if (game.t && game.t.user._id === this.user._id) return true

      return false
    }
  },
  beforeDestroy() {
    Object.values(this.handlers).forEach(i => clearInterval(i))
  }
}
