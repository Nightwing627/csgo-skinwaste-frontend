<template>
  <v-expansion-panels v-if="history.length">
    <v-expansion-panel v-for="game in history" :key="game.id">
      <v-expansion-panel-header color="grey700">
        <!-- eslint-disable-next-line -->
        <template v-slot:default="{ open }">
          <v-row no-gutters align="center">
            <v-col cols="8" sm="4">
              <h5 class="subtitle-2 lh-1 mb-1 primary--text">
                Bet #{{ getGameId(game) }}
              </h5>
              <div class="caption lh-1 subtitle-1">
                {{ getGameDate(game) }}
              </div>
            </v-col>
            <v-col cols="4" sm="8" class="disp-flex flex-center-y">
              <fai class="gold--text mr-2" :icon="['fas', 'coins']" />
              {{ getAmount(game) | currencyInt }}
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-header>

      <v-expansion-panel-content class="py-2 px-3 text-left" color="grey500">
        <v-row v-if="betValue != 'roulette'">
          <v-col cols="12" md="6">
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Total Items
              </div>
              {{ getTotalItems(game) }} items
            </div>

            <div v-if="getUser(game)" class="mb-2">
              <div class="overline light--text fw-bold">
                Winner
              </div>
              <div class="disp-flex flex-center-y">
                <v-img
                  width="32"
                  class="flex-no-grow flex-no-shrink mr-2 bdrd-1"
                  :src="getUser(game).avatar"
                />
                {{ getUser(game).username }}
              </div>
            </div>

            <div v-if="game.pf">
              <div class="overline light--text fw-bold">
                Game Hash
              </div>
              {{ game.pf.hash }}
            </div>
          </v-col>

          <v-col v-if="game.pf" cols="12" md="6">
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Game Ticket
              </div>
              {{ (game.pf.ticket * 1000).toFixed(6) }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Server Seed
              </div>
              {{ game.pf.seed }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Random Hash
              </div>
              {{ game.pf.randomHash }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Game Total
              </div>
              {{ game.pf.total }}
            </div>
            <div class="mb-2">
              <a
                class="caption text-uppercase secondary--text fw-bold"
                @click="verify(game.pf)"
              >
                Verify provably fair data
              </a>
            </div>
          </v-col>

          <template v-if="betValue">
            <v-row v-if="betValue !== 'ez'">
              <v-col cols="12">
                <div>
                  <div class="overline light--text fw-bold">
                    Game
                  </div>
                  <div v-if="game.gameType">
                    <span class="text-uppercase">{{ getBetTitle(game) }}</span>
                    ({{ game.game }})
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Bets
                  </div>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[1] }"
                    :field="1"
                  >
                    <fai :icon="['fad', 'dice-d4']" />
                    <span class="">{{
                      game.extra.bets[1] || 0 | currencyInt
                    }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[2] }"
                    :field="2"
                  >
                    <fai :icon="['fad', 'dice-d6']" /><span class="">
                      {{ game.extra.bets[2] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[5] }"
                    :field="5"
                  >
                    <fai :icon="['fad', 'dice-d8']" /><span class="">
                      {{ game.extra.bets[5] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[10] }"
                    :field="10"
                  >
                    <fai :icon="['fad', 'dice-d10']" /><span class="">
                      {{ game.extra.bets[10] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[20] }"
                    :field="10"
                  >
                    <fai :icon="['fad', 'dice-d12']" /><span class="">
                      {{ game.extra.bets[20] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[40] }"
                    :field="40"
                  >
                    <fai :icon="['fad', 'dice-d20']" /><span
                      class=" text-center"
                    >
                      {{ game.extra.bets[40] || 0 | currencyInt }}</span>
                  </span>
                </div>
                <div>
                  <div class="overline light--text fw-bold">
                    Game
                  </div>
                  <div>
                    <span class="text-uppercase">EZ</span> ({{ game.game }})
                  </div>
                </div>
              </v-col>
            </v-row>
          </template>
        </v-row>
        <v-row v-else>
          <v-col cols="12" md="6">
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Bet
              </div>
              $ {{ game.amount | currencyInt }}
            </div>

            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Bet Color
              </div>
              <div class="disp-flex flex-center-y">
                {{ capitalize(game.extra.field) }}
              </div>
            </div>

            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Win Color
              </div>
              <div class="disp-flex flex-center-y">
                {{
                  capitalize(games.find(_game => _game._id == game.game).roll)
                }}
              </div>
            </div>

            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Game Hash
              </div>
              <div>
                <span class="text-uppercase">{{ getBetTitle(game) }}</span>
                {{ games.find(_game => _game._id == game.game).gameHash }}
              </div>
            </div>

            <div v-if="game.pf">
              <div class="overline light--text fw-bold">
                Game Hash
              </div>
              {{ game.pf.hash }}
            </div>
          </v-col>

          <v-col v-if="game.pf" cols="12" md="6">
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Game Ticket
              </div>
              {{ (game.pf.ticket * 100).toFixed(6) }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Server Seed
              </div>
              {{ game.pf.seed }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Random Hash
              </div>
              {{ game.pf.randomHash }}
            </div>
            <div class="mb-2">
              <div class="overline light--text fw-bold">
                Game Total
              </div>
              {{ game.pf.total }}
            </div>
            <div class="mb-2">
              <a
                class="caption text-uppercase secondary--text fw-bold"
                @click="verify(game.pf)"
              >
                Verify provably fair data
              </a>
            </div>
          </v-col>

          <template v-if="betValue">
            <v-row v-if="betValue !== 'ez'">
              <v-col cols="12">
                <div>
                  <div class="overline light--text fw-bold">
                    Game
                  </div>
                  <div v-if="game.gameType">
                    <span class="text-uppercase">{{ getBetTitle(game) }}</span>
                    ({{ game.game }})
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col cols="12">
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Bets
                  </div>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[1] }"
                    :field="1"
                  >
                    <fai :icon="['fad', 'dice-d4']" />
                    <span class="">{{
                      game.extra.bets[1] || 0 | currencyInt
                    }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[2] }"
                    :field="2"
                  >
                    <fai :icon="['fad', 'dice-d6']" /><span class="">
                      {{ game.extra.bets[2] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[5] }"
                    :field="5"
                  >
                    <fai :icon="['fad', 'dice-d8']" /><span class="">
                      {{ game.extra.bets[5] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[10] }"
                    :field="10"
                  >
                    <fai :icon="['fad', 'dice-d10']" /><span class="">
                      {{ game.extra.bets[10] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[20] }"
                    :field="10"
                  >
                    <fai :icon="['fad', 'dice-d12']" /><span class="">
                      {{ game.extra.bets[20] || 0 | currencyInt }}</span>
                  </span>
                  <span
                    class="icon mr-3"
                    :class="{ selected: game.extra.bets[40] }"
                    :field="40"
                  >
                    <fai :icon="['fad', 'dice-d20']" /><span
                      class=" text-center"
                    >
                      {{ game.extra.bets[40] || 0 | currencyInt }}</span>
                  </span>
                </div>
                <div>
                  <div class="overline light--text fw-bold">
                    Game
                  </div>
                  <div>
                    <span class="text-uppercase">EZ</span> ({{ game.game }})
                  </div>
                </div>
              </v-col>
            </v-row>
          </template>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { createHash } from 'crypto'
import Chance from 'chance'


export default {
  name: 'BetHistory',
  props: {
    history: {
      type: Array,
      default: () => []
    },
    betValue: {
      type: String,
      default: ''
    },
    games: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: () => undefined
    }
  },
  methods: {
    getTotalItems(game) {
      if (game.bets) { return game.bets.reduce((acc, v) => acc + v.items.length, 0) }
      if (game.items) return game.items.length
      return 0
    },
    getAmount(game) {
      if (this.betValue === 'roulette') {
        const gameResult = this.games.find(_game => _game._id == game.game)
        if (game.extra.field == gameResult.roll) {
          if (gameResult.roll == 'gold') return game.amount * 30
          if (gameResult.roll == 'pink') return game.amount * 5
          if (gameResult.roll == 'purple') return game.amount * 3
          return game.amount
        }
        return 0 - game.amount
      }
      if (game.potValue) return game.potValue
      if (game.amount) return game.amount
      return 0
    },
    getGameId(game) {
      if (game.roundId) return game.roundId
      if (game.betID) return game.betID
      return ''
    },
    getGameDate(game) {
      if (game.rolledAt) { return new Date(game.rolledAt).toLocaleString(this.$i18n.locale) }
      if (game.createdAt) return new Date(game.createdAt).toLocaleString()
      return ''
    },
    getUser(game) {
      if (game.winner) return game.winner
      return this.user
    },
    getBetTitle(game) {
      const titles = {
        jackpot: 'Elite',
        silver: 'Silver',
        coinflip: 'Coinflip'
      }

      return titles[game.gameType] || ''
    },
    capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.seed}","random":"${pf.randomHash}","pot":${pf.total}}`
      const win = window.open(url, '_blank')
      win.focus()
    }
  }
}
</script>

<style>
.subtitle-1 {
  color: #777d9a;
}
</style>
