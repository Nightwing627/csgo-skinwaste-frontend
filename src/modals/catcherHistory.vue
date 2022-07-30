<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="text--text flex-between-x px-3 flex-center-y">
      <h2 class="fw-bold title font2 mb-2">
        Latest {{ history.length }} EZ Pots
      </h2>

      <!-- <v-btn
        color="grey500" class="ma-0 no-minwidth"
        @click="getInventory"
      >
        <fai class="grey100--text" :spin="loading" :icon="['fas','sync']" />
      </v-btn> -->
    </v-card-title>

    <v-card-text class="px-3 text-center" style="max-height: 600px;">
      <v-expansion-panels>
        <v-expansion-panel
          v-for="game in history"
          :key="game.id"
        >
          <v-expansion-panel-header color="grey300">
            <template v-slot:default="{ open }">
              <v-row no-gutters align="center">
                <v-col cols="8" sm="4">
                  <h5 class="subtitle-2 lh-1 mb-1">
                    GAME #{{ game.roundId }}
                  </h5>
                  <div class="caption lh-1">
                    {{ new Date(game.rolledAt).toLocaleString($i18n.locale) }}
                  </div>
                </v-col>
                <v-col cols="4" sm="8" class="round-history disp-flex flex-no-shrink flex-center-y text-right">
                  <span class="text-uppercase fw-bold mr-2 caption">{{ $t(`game.history.rolls`) }}</span>
                  <div class="rolls disp-flex flex-center-y">
                    <div v-for="(roll, i) in game.pf.results" :key="i" class="roll number fw-bold mx-1 chip px-2" :roll="roll.result === -7 ? '7x' : roll.result === -2 ? '2x' : roll.result">
                      {{ roll.result === -7 ? '7x' : roll.result === -2 ? '2x' : roll.result }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-2 px-3 text-left" color="grey500">
            <v-row>
              <v-col cols="12" md="6">
                <div>
                  <div class="overline light--text fw-bold">
                    GameID
                  </div>
                  {{ game.id }}
                </div>
                <div>
                  <div class="overline light--text fw-bold">
                    Game Hash
                  </div>
                  {{ game.pf.hash }}
                </div>
                <div>
                  <div class="overline light--text fw-bold">
                    Random Hash
                  </div>
                  <div class="disp-flex flex-center-y">
                    {{ game.pf.randomHash }}
                  </div>
                </div>
                <div class="mb-2">
                  <div class="overline light--text fw-bold">
                    Server Seed
                  </div>
                  {{ game.pf.seed }}
                </div>
                <div class="mb-2">
                  <a class="caption text-uppercase secondary--text fw-bold" @click="verify(game.pf)">
                    Verify provably fair data
                  </a>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div v-for="(result, i) in sortResults(game.pf.results)" :key="i" class="mb-3">
                  <div class="fw-bold">
                    Round {{ result.round }}
                  </div>
                  <div class="overline light--text fw-bold">
                    Round Hash
                  </div>
                  {{ result.hash }}
                  <div class="overline light--text fw-bold">
                    Index
                  </div>
                  {{ result.index }}
                  <div class="overline light--text fw-bold">
                    Result
                  </div>
                  {{ result.result === -7 ? '7x' : result.result === -2 ? '2x' : result.result }}
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
import sortBy from 'lodash.sortby'
import { sleep } from '@/utils'


export default {
  name: 'ModalJackpotHistory',
  props: ['close', 'payload', 'options'],
  metaInfo: {
    title: 'EZ History'
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      histories: 'wheel/history'
    }),
    history() {
      return this.histories.map(game => {
        const {
          id, pf, roundId, rolledAt
        } = game

        return {
          roundId,
          id,
          rolledAt,
          pf
        }
      })
    }
  },
  methods: {
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.seed}","random":"${pf.randomHash}","results":${JSON.stringify(pf.results)}}`
      const win = window.open(url, '_blank')
      win.focus()
    },
    sortResults(results) {
      const sort = sortBy(results, 'round')
      return sort
    },
    async copy(str) {
      if (!navigator.clipboard) {
        this.$toast.open({ type: 'error', text: 'Your browser doesn\'t support this feature.' })
        return
      }

      try {
        await navigator.clipboard.writeText(str)

        this.copied = true
        await sleep(1e3)
        this.copied = false
      } catch (err) {
        console.error('Failed to copy!', err)
        this.$toast.open({ type: 'error', text: 'Couldn\'t copy, sorry.' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.round-history {
  justify-content: flex-start;
  width: 100%;
  //max-width: 1000px;
  //margin-top: 60px;
  z-index: inherit;

  span {
    text-shadow: 0 0 8px black;
  }

  .roll {
    height: 28px;
    color: $text;
    padding-top: 7px;
    border-radius: 3px;
    box-shadow: 0 0 6px black;

    &[roll="1"] {
      color: $dark;
      background: $gold;
    }

    &[roll="2"] {
      background: #483ef3;
    }

    &[roll="5"] {
      background: #960084;
    }

    &[roll="10"] {
      background: #4d990b;
    }

    &[roll="20"] {
      color: $text;
      background: #f28e2c;
    }

    &[roll="40"] {
      background: #eb4d4b;
    }

    &[roll="7x"],
    &[roll="2x"] {
      color: $gold;
      background: $darker;
      border: 2px solid rgba($gold, 0.7);
    }
  }
}

.v-expansion-panel-content {
  ::v-deep .v-expansion-panel-content__wrap {
    padding: 0;
  }
}
</style>
