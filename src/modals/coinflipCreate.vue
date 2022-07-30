<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="d-block d-sm-flex grey700 text--text flex-between-x px-3 flex-center-y">
      <div>
        <h2 class="fw-bold title">
          Create a Coinflip
        </h2>
        <div class="disp-flex invvalue flex-center-y caption fw-bold">
          <span class="mr-3">
            <fai class="gold--text mr-1" :icon="['fas','coins']" />
            {{ inventoryValue | currencyInt }}
          </span>
          <span class="disp-iflex flex-center-y">
            <img class="gun-icon mr-1" src="@/assets/img/gun-icon.png" alt="gun icon">
            {{ items.length | intToLocale }}
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
          <v-sheet color="grey700" class="bdrd-0 d-flex flex-wrap flex-center full-height pa-3">
            <div class="coins flex-grow d-flex flex-center-y d-sm-block">
              <p class="caption fw-bold text-uppercase text-center mb-0 mb-sm-5">
                Pick a side
              </p>
              <CoinImage
                type="t" class="link coin mb-0 mb-sm-4" :class="{selected: side === 't'}" style="transform: scale(1.25);"
                @click="side = 't'"
              />
              <CoinImage
                type="ct" class="link coin" :class="{selected: side === 'ct'}" style="transform: scale(1.25);"
                @click="side = 'ct'"
              />
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
          :disabled="!canCreate"
          :loading="loading.create"
          @click="create"
        >
          Create
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
  name: 'ModalCoinflipCreate',
  components: {
    Inventory,
    CoinImage: () => import('@/components/coinflip/CoinImage.vue')
  },
  metaInfo: {
    title: 'Create a coinflip'
  },
  // eslint-disable-next-line
  props: ['close', 'options'],
  data() {
    return {
      items: [],
      search: '',
      side: null,
      loading: {
        inventory: false,
        create: false
      }
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
      inventory: 'user/inventory'
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
    canCreate() {
      if (!this.selected.length) return false
      if (!this.side) return false
      if (this.selected.length > this.config.coinflip.maxItemsPerPlayer) return false
      return true
    }
  },
  mounted() {
    this.refreshInventory()
  },
  methods: {
    ...mapActions({
      getInventory: 'user/getInventory',
      createCf: 'coinflip/create'
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
      } catch (unusedError) {
        //
      } finally {
        this.loading.inventory = false
      }
    },
    async create() {
      if (Object.values(this.loading).some(Boolean)) return
      if (!this.selected.length) return
      if (!this.side) return

      this.loading.create = true

      try {
        const itemids = this.selected.map(i => i.backpackId)
        await this.createCf({ side: this.side, itemids })

        this.$toast.open({ type: 'success', text: 'Your coinflip has been created.' })
        this.close()
        // eslint-disable-next-line
      } catch (unusedError) {
        //
      } finally {
        this.loading.create = false
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
  max-height: 450px;
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
  border: 3px solid transparent;
  border-radius: 50%;

  &.selected {
    // border-color: $primary;


    &::after {
      position: absolute;
      z-index: 3;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 60%;
      height: 60%;
      content: '';
      border-radius: 50%;
      border: 3px solid $primary;
    }
  }
}

@media only screen and (max-width: 599px) {
  .v-card__text {
    display: flex;
    flex-direction: column;
  }

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
}

</style>
