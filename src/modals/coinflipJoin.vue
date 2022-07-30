<template>
  <v-card v-if="game" class="modal grey900 ma-0">
    <v-card-title class="d-block d-sm-flex grey700 text--text flex-between-x px-3 flex-center-y">
      <div>
        <h2 class="fw-bold title">
          Join Coinflip
        </h2>
        <!-- <div class="disp-flex invvalue flex-center-y caption fw-bold">
          <span class="mr-3">
            <fai class="gold--text mr-1" :icon="['fas','coins']" />
            {{ inventoryValue | currencyInt }}
          </span>
          <span class="disp-iflex flex-center-y">
            <img class="gun-icon mr-1" src="@/assets/img/gun-icon.png" alt="gun icon">
            {{ items.length | intToLocale }}
          </span>
        </div> -->
        <div class="disp-flex invvalue flex-center-y body-2 fw-semibold">
          <span class="mr-2" :class="{'error--text': selectedValue < game.range.low}">
            <fai class="gold--text mr-1" :icon="['fas','coins']" />
            {{ game.range.low | currencyInt }}
          </span>
          <span>&ndash;</span>
          <span class="ml-2" :class="{'error--text': selectedValue > game.range.high}">
            <fai class="gold--text mr-1" :icon="['fas','coins']" />
            {{ game.range.high | currencyInt }}
          </span>
        </div>
      </div>


      <div class="disp-flex fw-regular flex-center">
        <v-text-field
          v-model="search"
          class="mr-2"
          background-color="grey500"
          hide-details placeholder="Search" solo dense
          flat
        />
        <v-btn
          color="grey500" class="ma-0 no-minwidth"
          @click="refreshInventory"
        >
          <fai class="grey100--text" :spin="loading.inventory" :icon="['fas','sync']" />
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="px-3 py-0 text-left pos-relative">
      <v-row class="content-ctn">
        <v-col cols="12" sm="2" lg="2" class="pa-0">
          <v-sheet color="grey700" class="coins-ctn bdrd-0 d-flex flex-wrap flex-center full-height pa-3">
            <div class="coins flex-grow">
              <div class="mb-0 mb-sm-8">
                <p class="caption fw-bold text-uppercase text-center mb-2">
                  Your Opponent
                </p>

                <v-tooltip color="primary" bottom nudge-bottom="-5">
                  <template v-slot:activator="{on}">
                    <v-img
                      width="80%" max-width="90" :aspect-ratio="1" contain
                      class="coin mx-auto flex-no-grow link"
                      :class="`side--${opponent.extra.side}`"
                      :src="opponent.user.avatar"
                      @click="$userMenu.open($event, opponent.user)"
                      v-on="on"
                    />
                  </template>
                  <span class="fw-bold">{{ opponent.user.username }}</span>
                </v-tooltip>
              </div>


              <div>
                <p class="caption mb-2 fw-bold text-uppercase text-center">
                  You
                </p>

                <Coin :type="side" style="transform:scale(1.25);" />
              </div>
            </div>
          </v-sheet>
        </v-col>
        <v-col cols="12" sm="10" lg="10" class="pt-3 pb-0">
          <Inventory :items="filteredItems" :loading="loading.inventory" @onItemClick="selectItem" />
          <div v-show="!loading.inventory && !items.length" class="mb-8">
            <v-btn
              depressed
              color="gold grey900--text"
              class="mx-4"
              @click="$modal.open('buy', {maxWidth: 900}); close()"
            >
              <div class="disp-flex flex-center-y">
                <fai :icon="['fas', 'coins']" class="mr-3" />
                <span>Get items</span>
              </div>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-between-x">
      <div class="grey100--text lh-1-2">
        <div class="disp-flex flex-center-y">
          <fai class="gold--text mr-2" :icon="['fas','coins']" />
          <span>{{ selectedValue | currencyInt }}</span>
        </div>
        <div class="body-2 grey100--text">
          <span>{{ selected.length }}</span>
          <span class="caption faded-5">/{{ config.coinflip.maxItemsPerPlayer }}</span>
          items <span class="d-none d-sm-inline">selected</span>
        </div>
      </div>
      <div class="btns">
        <v-btn
          small text :ripple="false"
          class="px-2 fw-bold mr-2"
          @click="close"
        >
          Cancel
        </v-btn>

        <v-btn
          color="success"
          large depressed :ripple="false"
          class="px-4 px-sm-8 fw-bold"
          :disabled="!canJoin"
          :loading="loading.join"
          @click="join"
        >
          Join as {{ side }}
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortBy from 'lodash.sortby'

import { sleep } from '../utils'

export default {
  needsAuth: true,
  name: 'ModalCoinflipCreate',
  components: {
    Inventory: () => import('@/components/Inventory'),
    Coin: () => import('@/components/coinflip/CoinImage.vue')
  },
  metaInfo: {
    title: 'Join coinflip'
  },
  // eslint-disable-next-line
  props: ['close', 'options', 'payload'],
  data() {
    return {
      gameId: this.payload.coinflip,
      closing: false,
      //
      items: [],
      search: '',
      loading: {
        inventory: false,
        join: false
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
    selected() {
      return this.items.filter(i => i.selected)
    },
    selectedValue() {
      return this.selected.reduce((acc, i) => acc + i.price, 0)
    },
    filteredItems() {
      let items = this.items.filter(i => i.price <= this.game.range.high)

      if (this.search !== '') {
        items = items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
      }

      // TODO: settings
      if (this.selectedValue) {
        items = items.filter(i => {
          if (i.selected) return true
          return i.price <= (this.game.range.high - this.selectedValue)
        })
      }

      return items
    },
    inventoryValue() {
      return this.items.reduce((acc, i) => acc + i.price, 0)
    },
    game() {
      if (!this.games) return null
      return this.games.find(i => i.id === this.payload.coinflip)
    },
    opponent() {
      if (!this.game) return null

      if (this.game.ct) return this.game.ct
      return this.game.t
    },
    side() {
      if (!this.game) return null

      if (this.game.ct) return 't'
      return 'ct'
    },
    canJoin() {
      if (!this.selected.length) return false
      if (this.selected.length > this.config.coinflip.maxItemsPerPlayer) return false
      if (this.selectedValue > this.game.range.high) return false
      if (this.selectedValue < this.game.range.low) return false
      return true
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
    },
    game(game) {
      if (!game || game.state > 0) {
        if (this.closing || this.loading.join) return
        this.close()
        this.$toast.open({ type: 'error', text: 'This game is no longer available.' })
      }
    },
    inventory: {
      handler(val) {
        this.items = sortBy(val.map(i => ({ ...i, selected: false })), 'price').reverse()
      },
      deep: true
    }
  },
  mounted() {
    this.refreshInventory()
  },
  methods: {
    ...mapActions({
      getInventory: 'user/getInventory',
      joinCf: 'coinflip/join'
    }),
    selectItem(item) {
      if (Object.values(this.loading).some(Boolean)) return

      // eslint-disable-next-line no-param-reassign
      item.selected = !item.selected
    },
    async refreshInventory() {
      if (this.loading.inventory) return
      this.loading.inventory = true

      try {
        await this.getInventory()
        // eslint-disable-next-line
      } catch {} finally {
        this.loading.inventory = false
      }
    },
    async join() {
      if (Object.values(this.loading).some(Boolean)) return
      if (!this.selected.length) return
      if (!this.game.id) return

      this.loading.join = true

      try {
        const itemids = this.selected.map(i => i.backpackId)
        await this.joinCf({ id: this.game.id, itemids })
        this.closing = true

        this.$toast.open({ type: 'success', text: 'Successfully joined game, good luck :)' })
        this.close()

        if (!this.payload.watching) {
          await sleep(500)
          this.$modal.open('coinflipView', { maxWidth: 700, noShadow: true }, { coinflip: this.game.id })
        }
        // eslint-disable-next-line
      } catch {} finally {
        this.loading.join = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// inv
.inventory-ctn {
  height: 100%;
  min-height: 250px;
  max-height: 500px;
}

.inventory-ctn ::v-deep .inventory-items {
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 15px !important;
  }

  &::-webkit-scrollbar-thumb {
    border: 5px solid rgba(0, 0, 0, 0);
    border-radius: 15px !important;
    background-color: lighten($grey500, 10) !important;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    border: solid 6px transparent;
    background-color: $grey700 !important;
    background-clip: padding-box;
  }
}

.v-card__actions {
  box-shadow: 0 -5px 20px rgba(black, 0.7);
}

.coins .coin {
  box-sizing: content-box;
  border: 3px solid transparent;
  border-radius: 50%;

  &.selected {
    border-color: $primary;
  }
}

@media only screen and (max-width: 599px) {
  .v-card__text {
    display: flex;
    flex-direction: column;
  }

  // .inventory-ctn {
  //   max-height: unset;
  // }

  .v-sheet.coins-ctn {
    padding: 4px 10px !important;

    .coins {
      display: flex;

      > div {
        flex-basis: 50%;
      }

      .coin {
        max-width: 42px !important;
        flex-shrink: 0;
      }
    }
  }

  .content-ctn {
    flex-grow: 1;
    height: 100%;
  }

  // .invvalue {
  //   justify-content: flex-start !important;
  // }
}
</style>
