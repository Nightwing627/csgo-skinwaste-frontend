<template>
  <v-card class="modal ma-0">
    <v-card-text class="px-3 pb-0 text-center text--text pos-relative">
      <div v-if="game" class="disp-flex flex-center pos-relative">
        <CoinflipCoinResult
          :game="game" :timer="timer" :round-time-limit="config.coinflip.roundTimeLimit"
          :show-winner.sync="showWinner"
          @timer="initTimer($event)"
        />
      </div>

      <!-- players -->
      <v-row v-if="game" class="grey700 pt-3 bdrd-3">
        <v-col cols="6" class="pb-0">
          <div v-if="game.t" class="coins">
            <div class="coin-ctn">
              <CoinAvatar
                class="mb-8"
                :class="{winner: showWinner && game.winner.user._id === game.t.user._id}"
                type="coin"
                :src="game.t.user.avatar"
                :side="game.t.extra.side"
              />

              <CoinAvatar v-if="game.t" type="sub" src="t" :side="game.t.extra.side" />
            </div>

            <div class="player pl-3 grey500 bdrd-1 disp-flex flex-center-y side--ct" :style="{'--color': '#F3F3F3'}" :class="{winner: showWinner && game.winner.user._id === game.t.user._id}">
              <div class="disp-flex of-hidden flex-grow flex-center-y py-3">
                <v-img
                  :src="game.t.user.avatar" class="flex-no-grow rounded-circle mr-3 link" :aspect-ratio="1" width="40"
                  @click="$userMenu.open($event, game.t.user.id)"
                />
                <div class="lh-1 of-hidden">
                  <div class="body-2 fw-semibold text--text disp-flex flex-center-y link" @click="$userMenu.open($event, game.t.user.id)">
                    {{ game.t.user.username | truncate(16) }}
                    <v-tooltip top color="info">
                      <template v-slot:activator="{on}">
                        <fai v-if="game.t.user.rank === 1" :icon="['fas', 'badge-check']" class="ml-1 info--text" v-on="on" />
                      </template>
                      <div class="caption fw-bold">
                        Verified User
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="caption disp-flex flex-center-y flex-wrap">
                    <span class="no-wrap disp-flex grey100--text fw-regular flex-center-y mr-1">
                      Deposited
                    </span>

                    <span class="no-wrap disp-flex flex-center-y">
                      ${{ game.t.amount | currencyInt }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="game.ct" class="d-flex flex-center percent side--t mr-2">
                <div class="caption">
                  {{ +(game.t.amount / game.total * 100).toFixed(3) }}%
                </div>
              </div>
            </div>

            <transition-group
              name="v-scale" tag="div"
              class="items flex-wrap flex-center-x disp-flex py-3"
            >
              <Item
                v-for="item in sortItems(game.t.items)" :key="item.backpackId"
                :data="item"
              />
            </transition-group>
          </div>

          <div v-else class="coins">
            <CoinAvatar type="coin" class="mb-2" src="t" style="transform:scale(1.5)" />

            <v-btn color="primary" small :disabled="isOwn" @click="$modal.open('coinflipJoin', {maxWidth: 900, watching: true}, {coinflip: game.id})">
              Join as T
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="pb-0">
          <div v-if="game.ct" class="coins">
            <div class="coin-ctn">
              <v-img
                width="80%" max-width="100" :aspect-ratio="1" contain
                class="coin mx-auto flex-no-grow mb-8 side--ct"
                :class="{winner: showWinner && game.winner.user._id === game.ct.user._id}"
                :src="game.ct.user.avatar"
              />

              <CoinAvatar v-if="game.ct" type="sub" src="ct" :side="game.ct.extra.side" />
            </div>
            <div class="player pl-3 grey500 bdrd-1 disp-flex flex-center-y side--ct" :style="{'--color': '#9C97FF'}" :class="{winner: showWinner && game.winner.user._id === game.ct.user._id}">
              <div class="disp-flex of-hidden flex-grow flex-center-y py-3">
                <v-img
                  :src="game.ct.user.avatar" class="flex-no-grow rounded-circle mr-3 link" :aspect-ratio="1" width="40"
                  @click="$userMenu.open($event, game.ct.user.id)"
                />
                <div class="lh-1 of-hidden">
                  <div class="body-2 fw-semibold text--text disp-flex flex-center-y link" @click="$userMenu.open($event, game.ct.user.id)">
                    {{ game.ct.user.username | truncate(16) }}
                    <v-tooltip top color="info">
                      <template v-slot:activator="{on}">
                        <fai v-if="game.ct.user.rank === 1" :icon="['fas', 'badge-check']" class="ml-1 info--text" v-on="on" />
                      </template>
                      <div class="caption fw-bold">
                        Verified User
                      </div>
                    </v-tooltip>
                  </div>
                  <div class="caption disp-flex flex-center-y flex-wrap">
                    <span class="no-wrap disp-flex grey100--text fw-regular flex-center-y mr-1">
                      Deposited
                    </span>

                    <span class="no-wrap disp-flex flex-center-y">
                      ${{ game.ct.amount | currencyInt }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="game.t" class="d-flex flex-center percent side--ct mr-2">
                <div class="caption">
                  {{ +(game.ct.amount / game.total * 100).toFixed(3) }}%
                </div>
              </div>
            </div>


            <transition-group
              name="v-scale" tag="div"
              class="items flex-wrap flex-center-x disp-flex py-3"
            >
              <Item
                v-for="item in sortItems(game.ct.items)" :key="item.backpackId"
                :data="item"
              />
            </transition-group>
          </div>

          <div v-else class="coins">
            <CoinAvatar type="coin" class="mb-2" src="ct" style="transform:scale(1.5)" />

            <v-btn
              color="info"
              small
              :disabled="isOwn"
              @click="$modal.open('coinflipJoin', {maxWidth: 900}, {coinflip: game.id, watching: true})"
            >
              Join as CT
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" class="caption text-left grey900">
          <div class="faded-5">
            <b>ID:</b> {{ game.id }}
          </div>
          <div class="faded-5">
            <b>Hash:</b> {{ game.pf.hash }}
          </div>
          <div v-if="game.pf.seed" class="faded-5">
            <b>Seed:</b> {{ game.pf.seed }}
          </div>
          <div v-if="game.pf.ticket && showWinner" class="faded-5">
            <b>Ticket:</b> {{ game.pf.ticket * 100 }}%
          </div>
        </v-col>
      </v-row>
      <v-progress-circular v-else class="my-8" indeterminate size="46" />
    </v-card-text>

    <v-card-actions class="pa-4 grey900 flex-center-y flex-end-x">
      <div class="btns">
        <v-btn
          small text :ripple="false"
          class="px-2 fw-bold mr-2"
          @click="close"
        >
          Close
        </v-btn>

        <v-btn
          v-show="canCancel"
          color="primary" small depressed
          :ripple="false"
          class="px-4 fw-bold"
          :loading="loading.cancel"
          @click="cancel"
        >
          Cancel
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortBy from 'lodash.sortby'

import CoinflipCoinResult from '@/components/coinflip/CoinResult.vue'
import CoinAvatar from '@/components/coinflip/CoinAvatar.vue'
import Item from '@/components/Item'


export default {
  name: 'ModalCoinflipView',
  components: {
    Item,
    CoinflipCoinResult,
    CoinAvatar
  },
  metaInfo: {
    title: 'View Coinflip'
  },
  props: {
    close: {
      type: Function,
      default: () => undefined
    },
    options: {
      type: Object,
      default: () => undefined
    },
    payload: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      spriteSheet: null,
      gameId: this.payload.coinflip,
      //
      showWinner: false,
      //
      timer: 0,
      timerHandler: null,
      //
      closing: false,
      loading: {
        game: false,
        cancel: false
      }
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      inventory: 'user/inventory',
      games: 'coinflip/games'
    }),
    game() {
      if (!this.games) return null
      return this.games.find(i => i.id === this.payload.coinflip)
    },
    isOwn() {
      if (!this.user) return false
      if (!this.game) return false
      if (this.game.ct && this.game.ct.user._id === this.user._id) return true
      if (this.game.t && this.game.t.user._id === this.user._id) return true

      return false
    },
    canCancel() {
      if (!this.user) return false
      if (!this.game) return false
      if (this.game.state !== 0) return false
      return this.user._id === this.game.creator
    }
  },
  watch: {
    loading: {
      handler() {
        this.$emit('update:options', {
          ...this.options,
          persistent: Object.values(this.loading).some(Boolean)
        })
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.timerHandler) {
      window.clearInterval(this.timerHandler)
    }
  },
  methods: {
    ...mapActions({
      getGame: 'coinflip/getGame',
      cancelCf: 'coinflip/cancel'
    }),

    async cancel() {
      if (Object.values(this.loading).some(Boolean)) {
        return
      }

      if (!this.game.id) {
        return
      }

      this.loading.cancel = true

      try {
        await this.cancelCf(this.game.id)
        this.$toast.open({ type: 'success', text: 'You cancelled this coinflip.' })

        this.closing = true
        this.close()
        // eslint-disable-next-line
      } catch {} finally {
        this.loading.cancel = false
      }
    },

    initTimer(val) {
      if (!val) return
      if (this.timerHandler) window.clearInterval(this.timerHandler)

      this.timer = Math.round((val - Date.now()) / 1000)
      if (this.timer <= 0) return

      this.timerHandler = setInterval(() => {
        this.timer = Math.round((val - Date.now()) / 1000)
        if (this.timer <= 0) window.clearInterval(this.timerHandler)
      }, 1e3)
    },
    sortItems(items) {
      return sortBy(items, 'price').reverse()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  background: none !important;
  box-shadow: none !important;
}

.v-card__text {
  // overflow-y: hidden !important;

  &::-webkit-scrollbar {
    display: none;
  }
}


.coins {
  .coin-ctn {
    position: relative;

    .coin {
      box-sizing: content-box;
      border: 5px solid transparent;
      border-radius: 50%;
      transition: border 0.3s ease;

      &.winner {
        animation: bounce 0.3s ease infinite alternate;

        &.side--t {
          border-color: $whiteish;
        }

        &.side--ct {
          border-color: $primary;
        }
      }
    }

    .sub-coin {
      position: absolute;

      &.side--ct {
        bottom: 0;
        left: 30%;
      }

      &.side--t {
        right: 30%;
        bottom: 0;
      }
    }

    span.winner {
      color: $primary;
      font-weight: bold !important;
    }
  }
}

.player {
  position: relative;

  &::before {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 1px solid rgba($light, 0.5);
    border-right: 1px solid rgba($light, 0.5);
    border-bottom: 1px solid rgba($light, 0.5);
    // opacity: 0.1;
    // background-color: var(--color);
    border-radius: 3px;
    background-color: $grey500;
    content: ' ';
    transition: background 0.3s ease;
    pointer-events: none;
  }

  &::after {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: /* gradient can be an image */
      linear-gradient(
        to bottom,
        rgba($light, 0.5),
        rgba($light, 0.5) 10%,
        #82827400 10%,
        #d7f0a200 20%,
        var(--color) 20%,
        var(--color) 80%,
        #82827400 80%,
        #d7f0a200 90%,
        rgba($light, 0.5) 90%,
        rgba($light, 0.5) 99%,
      )
      left
      bottom
      no-repeat;
    content: ' ';
  }

  > * {
    z-index: 1;
  }

  .percent {
    position: relative;
    z-index: 3;
    width: 70px;
    height: 45px;
    border: 1px solid;
    border-radius: 3px;
    color: $text;

    > div {
      position: relative;
      z-index: 2;
    }

    &.side--ct {
      border-color: $primary;

      &::before {
        background-color: $primary;
      }
    }

    &.side--t {
      border-color: $whiteish;

      &::before {
        background-color: $whiteish;
      }
    }

    &::before {
      position: absolute;
      z-index: 2;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background-color: var(--color);
      content: '';
    }
  }

  .color {
    position: relative;
    width: 30px;
    background-color: var(--color);
    background-image:
      linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
    background-repeat: repeat;
    background-size: 2em 2em;
    transition: width 0.3s ease-in-out;
  }

  &.side--ct {
    background: rgba($info, 0.1) !important;

    .color {
      background-color: $info;
    }
  }

  &.side--t {
    background: rgba($primary, 0.1) !important;

    .color {
      background-color: $primary;
    }
  }

  &.winner {
    .color {
      width: 50px;
      animation: progress-bar-stripes 0.3s linear infinite;
    }
  }
}

.of-hidden {
  overflow: hidden;
}

.items .item {
  min-width: 110px;
  max-width: 130px;
  // flex-grow: 0;
  margin: 0 4px 6px 4px !important;

  ::v-deep {
    .itemattr-wear {
      display: none;
    }

    .itemattr-price {
      font-size: 11px;
    }

    .meta {
      .item-info {
        font-size: 11px;
      }
    }
  }
}

// smooth timer circle
::v-deep .v-progress-circular__overlay {
  transition: all 1s linear;
}

@media only screen and (max-width: 599px) {
  .v-card__text {
    display: flex;
    flex-direction: column;
  }

  .modal {
    background: $grey700 !important;
  }
}

@keyframes bounce {
  from {
    transform: translateY(0) scaleY(0.92);
  }

  to {
    transform: translateY(-20px) scaleY(1.04);
  }
}

@keyframes progress-bar-stripes {
  from { background-position: 2em 0; }
  to { background-position: 0 0; }
}

</style>
