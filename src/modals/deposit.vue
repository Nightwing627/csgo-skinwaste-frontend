<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="d-block d-sm-flex text--text flex-between-x px-3 flex-center-y">
      <div>
        <h2 class="fw-bold title">
          Deposit into {{ pot.toUpperCase() }}
        </h2>

        <div class="mb-1 mb-sm-0 disp-flex flex-center-y lh-1 caption fw-semibold rules text-uppercase">
          <!-- <span v-if="potConfig.minItemPerRound" class="px-3 py-2 bdrd-1 ma-1 ml-0" :class="potConfigErrors.minItems">Min {{ potConfig.minItemPerRound }} items</span> -->
          <span v-if="potConfig.maxItemsPerPlayer" class="px-3 py-2 bdrd-1 ma-1 ml-0" :class="potConfigErrors.maxItems">Max {{ potConfig.maxItemsPerPlayer }} items</span>
          <span v-if="potConfig.minBet" class="px-3 py-2 bdrd-1 ma-1" :class="potConfigErrors.minBet">Min {{ potConfig.minBet | currencyInt }} bet</span>
          <span v-if="potConfig.maxBet" class="px-3 py-2 bdrd-1 ma-1 mr-0" :class="potConfigErrors.maxBet">Max {{ potConfig.maxBet | currencyInt }} bet</span>
        </div>
      </div>

      <div>
        <div class="disp-flex invvalue flex-center-y caption fw-bold flex-end-x mb-1">
          <span class="mr-3">
            <fai class="gold--text mr-1" :icon="['fas','coins']" />
            {{ inventoryValue | currencyInt }}
          </span>
          <span class="disp-iflex flex-center-y">
            <img class="gun-icon mr-1" src="@/assets/img/gun-icon.png" alt="gun icon">
            {{ items.length | intToLocale }}
          </span>
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
            @click="getInventory"
          >
            <fai class="grey100--text" :spin="loading" :icon="['fas','sync']" />
          </v-btn>
        </div>
      </div>
    </v-card-title>

    <v-card-text class="px-3 pt-1 pt-sm-3 pb-0 text-center pos-relative">
      <Inventory :items="filteredItems" :loading="loading" @onItemClick="selectItem" />
      <div v-show="!loading && !items.length" class="mb-8">
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
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-between-x">
      <div class="grey100--text lh-1-2">
        <div class="disp-flex flex-center-y" :class="{'error--text fw-bold': potConfigErrors.minBet === 'error'}">
          <fai class="gold--text mr-2" :icon="['fas','coins']" />
          <span>{{ selectedValue | currencyInt }}</span>
          <span v-if="potConfig.maxBet" class="caption faded-5">/{{ potConfig.maxBet - depositedValue | currencyInt }}</span>
        </div>
        <div class="body-2 grey100--text">
          <span>{{ selected.length }}</span>
          <span v-if="potConfig.maxItemsPerPlayer" class="caption faded-5">/{{ potConfig.maxItemsPerPlayer - depositedItems.length }}</span>
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
          :disabled="!canDeposit"
          :loading="depositLoading"
          @click="deposit"
        >
          Deposit
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import sortBy from 'lodash.sortby'

import Inventory from '@/components/Inventory'

export default {
  needsAuth: true,
  name: 'ModalDeposit',
  components: {
    Inventory
  },
  metaInfo: {
    title: 'Deposit'
  },
  props: ['close', 'payload', 'options'],
  data() {
    return {
      pot: this.payload.pot,
      items: [],
      search: ''
    }
  },
  watch: {
    depositLoading(val) {
      this.$emit('update:options', { ...this.options, persistent: val })
    },
    inventory: {
      handler(val) {
        this.items = sortBy(val.map(i => ({ ...i, selected: false })), 'price').reverse()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      inventory: 'user/inventory',
      loading: 'user/inventoryLoading',
      depositLoading: 'jackpot/depositLoading',
      pots: 'jackpot/pots'
    }),
    selected() {
      return this.items.filter(i => i.selected)
    },
    selectedValue() {
      return this.selected.reduce((acc, i) => acc + i.price, 0)
    },
    filteredItems() {
      if (this.search === '') return this.items
      return this.items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
    },
    inventoryValue() {
      return this.items.reduce((acc, i) => acc + i.price, 0)
    },
    potConfig() {
      return this.config.jackpot[this.pot]
    },
    potItems() {
      return this.pots[this.pot].bets
        .reduce((acc, bet) => [...acc, ...bet.items.map(i => ({ ...i, userId: bet.userId }))], [])
    },
    potConfigErrors() {
      if (!this.selected.length) return {}
      const selected = [...this.selected, ...this.depositedItems]
      const value = this.selectedValue + this.depositedValue

      const errors = {}

      if (this.potConfig.maxItemsPerPlayer) {
        errors.maxItems = selected.length > this.potConfig.maxItemsPerPlayer ? 'error' : 'success'
      }

      if (this.potConfig.minItemPerRound) {
        errors.minItems = selected.length < this.potConfig.minItemPerRound ? 'error' : 'success'
      }

      if (this.potConfig.maxBet) {
        errors.maxBet = value > this.potConfig.maxBet ? 'error' : 'success'
      }

      if (this.potConfig.minBet) {
        errors.minBet = this.selectedValue < this.potConfig.minBet ? 'error' : 'success'
      }

      return errors
    },
    canDeposit() {
      if (!this.selected.length) return true
      return Object.values(this.potConfigErrors).every(i => i === 'success')
    },
    depositedItems() {
      if (this.pots[this.pot].status === 'rolling') return []
      return this.potItems.filter(i => i.userId === this.user._id)
    },
    depositedValue() {
      if (this.pots[this.pot].status === 'rolling') return 0
      return this.depositedItems.map(i => i.price).reduce((acc, v) => acc + v, 0)
    }
  },
  mounted() {
    //
    this.getInventory()
  },
  methods: {
    ...mapActions({
      getInventory: 'user/getInventory',
      bet: 'jackpot/bet'
    }),
    selectItem(item) {
      if (this.loading) return
      if (this.depositLoading) return

      const val = !item.selected
      // eslint-disable-next-line no-param-reassign
      item.selected = val
    },
    async deposit() {
      if (!this.selected.length) return

      try {
        const itemids = this.selected.map(i => i.backpackId)
        const resp = await this.bet({ pot: this.pot, itemids })

        if (!resp) {
          this.$toast.open({ type: 'success', text: 'Bet has been placed into the next round' })
        } else {
          this.$toast.open({ type: 'success', text: 'Bet has been placed' })
        }

        this.close()
      } catch {}
    }
  }
}
</script>

<style lang="scss" scoped>
// inv
.inventory-ctn {
  height: 100%;
  min-height: 300px;
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

.rules span {
  background: $grey500;
  transition: background 0.5s ease;
}

.v-card__actions {
  box-shadow: 0 -5px 20px rgba(black, 0.7);
}

@media only screen and (max-width: 599px) {
  .v-card__text {
    display: flex;
    flex-direction: column;
  }

  .inventory-ctn {
    max-height: unset;
  }

  .rules span {
    padding: 6px 6px !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }

  .invvalue {
    justify-content: flex-start !important;
  }
}

</style>
