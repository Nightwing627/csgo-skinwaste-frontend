<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="text--text flex-between-x px-3 flex-center-y">
      <h2 class="fw-bold title font2 mb-2">
        Latest {{ history ? history.length : '...' }} Coinflips
      </h2>
      <v-btn
        color="grey500" class="ma-0 no-minwidth"
        @click="refreshHistory"
      >
        <fai class="grey100--text" :spin="loading" :icon="['fas','sync']" />
      </v-btn>
    </v-card-title>

    <v-card-text class="px-3 text-center" style="max-height: 600px;">
      <v-expansion-panels v-if="history">
        <v-expansion-panel
          v-for="game in history"
          :key="game.id"
        >
          <v-expansion-panel-header color="grey700">
            <template v-slot:default="{ open }">
              <v-row no-gutters align="center">
                <v-col cols="8" sm="4">
                  <h5 class="subtitle-2 lh-1 mb-1 primary--text">
                    GAME #{{ game.roundID }}
                  </h5>
                  <div class="caption lh-1 subtitle-1">
                    {{ new Date(game.endTime).toLocaleString($i18n.locale) }}
                  </div>
                </v-col>
                <v-col cols="4" sm="8" class="disp-flex flex-center-y">
                  <fai class="gold--text mr-2" :icon="['fas', 'coins']" />
                  {{ game.pot | currencyInt }}
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-2 px-3 text-left" color="grey500">
            <v-row>
              <v-col cols="12" md="6">
                <div>
                  <div class="overline light--text fw-bold">
                    Game Hash
                  </div>
                  {{ game.gameHash }}
                </div>
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Game Ticket
                  </div>
                  {{ (game.percent * 100).toFixed(6) }}
                </div>
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Server Seed
                  </div>
                  {{ game.unencodedServerHash }}
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Random Hash
                  </div>
                  {{ game.randomHash }}
                </div>
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Game Total
                  </div>
                  {{ game.pot }}
                </div>
                <div class="mb-2">
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
                <div class="mb-2">
                  <a class="caption text-uppercase secondary--text fw-bold" @click="verify(game)">
                    Verify provably fair data
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-progress-circular v-else indeterminate color="primary" size="72" />
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn
        small text :ripple="false"
        class="px-2 fw-bold"
        @click="close"
      >
        Close
      </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'


export default {
  name: 'ModalCoinflipHistory',
  props: ['close', 'options'],
  data() {
    return {
      loading: false
    }
  },
  metaInfo: {
    title: 'Coinflip History'
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      history: 'coinflip/history'
    })
  },
  created() {
    this.refreshHistory()
  },
  methods: {
    ...mapActions({
      getHistory: 'coinflip/getHistory'
    }),
    async refreshHistory() {
      if (this.loading) return
      this.loading = true

      try {
        await this.getHistory()
      } catch { } finally {
        this.loading = false
      }
    },
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.unencodedServerHash}","random":"${pf.randomHash}","pot":${pf.pot}}`
      const win = window.open(url, '_blank')
      win.focus()
    },
    getUser(game) {
      if (game.winner) return game.winner;
      return this.user;
    },
  }
}
</script>

<style lang="scss" scoped>
.subtitle-1{
 color: #777d9a
}

.v-expansion-panel-content {
  ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
