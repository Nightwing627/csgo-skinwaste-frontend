<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="text--text flex-between-x px-3 flex-center-y">
      <h2 class="fw-bold title font2 mb-2">
        Latest {{ history.length }} {{ pot.toUpperCase() }} Pots
      </h2>
    </v-card-title>

    <v-card-text class="px-3 text-center" color="grey700" style="max-height: 600px;">
      <BetHistory :history="history" />
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn
        small text :ripple="false"
        class="px-2 fw-bold"
        @click="close"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { JACKPOT_COLORS } from '@/utils/constants'


export default {
  name: 'ModalJackpotHistory',
  components: {
    BetHistory: () => import('@/components/BetHistory.vue')
  },
  // eslint-disable-next-line
  props: ['close', 'payload', 'options'],
  data() {
    return {
      pot: this.payload.pot
    }
  },
  metaInfo: {
    title: 'Jackpot History'
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      histories: 'jackpot/histories'
    }),
    history() {
      return this.histories[this.pot].map(game => {
        const {
          id, pf, roundId, rolledAt, bets
        } = game
        const players = this.getHistoryPlayers(bets, game.players)
        const potValue = bets.map(i => i.amount).reduce((acc, v) => acc + v, 0)
        const winner = players.find(i => i.id === game.pf.winnerId)

        winner.totalBet = winner.bets
          .map(i => i.amount)
          .reduce((acc, v) => acc + v, 0)

        winner.winChance = (winner.totalBet / potValue) * 100

        return {
          roundId,
          id,
          rolledAt,
          bets,
          pf,
          players,
          winner,
          potValue
        }
      })
    }
  },
  methods: {
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
    },
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.seed}","random":"${pf.randomHash}","pot":${pf.total}}`
      const win = window.open(url, '_blank')
      win.focus()
    }
  }
}
</script>

<style lang="scss" scoped>

.v-expansion-panel-content {
  ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
