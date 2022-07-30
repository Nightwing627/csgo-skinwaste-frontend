<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="d-block d-sm-flex text--text flex-between-x px-3 flex-center-y">
      <div class="d-flex d-sm-block mb-1 mb-sm-0 flex-center-y flex-between-x">
        <h2 class="fw-bold title font2">
          Your inventory
        </h2>
        <div class="disp-flex body-2 flex-center-y">
          <span class="mr-2">Balance</span>
          <fai class="gold--text mr-1" :icon="['fas','coins']" />
          <span class="fw-bold">{{ user.balance | currencyInt }}</span>
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
          <v-tooltip color="grey300" bottom>
            <template v-slot:activator="{on}">
              <v-btn
                :color="allSelected ? 'secondary700' : 'grey500'" class="mr-2 no-minwidth"
                @click="selectAll" v-on="on"
              >
                <fai class="grey100--text" :icon="['fas','layer-group']" />
              </v-btn>
            </template>
            <span>Select all</span>
          </v-tooltip>
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

    <v-card-text class="px-3 pt-3 pb-0 text-center">
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
        <div class="disp-flex flex-center-y">
          <fai class="gold--text mr-2" :icon="['fas','coins']" />
          <span>{{ selectedValue | currencyInt }}</span>
        </div>
        <div class="body-2 grey100--text">
          {{ selected.length }} items selected
        </div>
      </div>
      <div class="btns">
        <v-btn
          small text :ripple="false"
          class="px-2 fw-bold mr-2"
          @click="close"
        >
          Close
        </v-btn>

        <v-btn
          color="secondary"
          large depressed :ripple="false"
          class="px-4 fw-bold"
          :loading="selling"
          @click="sell"
        >
          Sell
          <span class="ml-1 d-none d-sm-block">
            for
            <fai class="gold--text ml-1 mr-2" :icon="['fas','coins']" />
            <span>{{ selectedValue | currencyInt }}</span>
          </span>
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortBy from 'lodash.sortby'

import { store as api } from '@/api'

import Inventory from '@/components/Inventory'
import { errorToast } from '@/utils'

export default {
  needsAuth: true,
  name: 'ModalSell',
  components: {
    Inventory
  },
  metaInfo: {
    title: 'Sell Items'
  },
  props: ['close', 'options'],
  data() {
    return {
      items: [],
      search: '',
      selling: false
    }
  },
  watch: {
    selling(val) {
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
      loading: 'user/inventoryLoading'
    }),
    selected() {
      return this.items.filter(i => i.selected)
    },
    allSelected() {
      if (!this.items.length) return false
      return this.items.every(i => i.selected)
    },
    selectedValue() {
      return this.selected.reduce((acc, i) => acc + i.price, 0)
    },
    inventoryValue() {
      return this.items.reduce((acc, i) => acc + i.price, 0)
    },
    filteredItems() {
      if (this.search === '') return this.items
      return this.items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted() {
    //
    this.getInventory()
  },
  methods: {
    ...mapActions({
      getInventory: 'user/getInventory'
    }),
    ...mapMutations({
      setBalance: 'user/setBalance',
      removeItems: 'user/removeItems'
    }),
    selectItem(item) {
      if (this.loading) return
      if (this.selling) return

      const val = !item.selected
      // eslint-disable-next-line no-param-reassign
      item.selected = val
    },
    selectAll() {
      if (this.loading) return
      if (this.selling) return

      const selected = this.allSelected

      this.items.forEach(i => {
        i.selected = !selected
      })
    },
    async sell() {
      if (this.selling) return
      if (!this.selected.length) return

      this.selling = true

      try {
        const backpackIds = this.selected.map(i => i.backpackId)
        const { balance } = await api.sell(backpackIds)
        this.setBalance(balance)

        this.$toast.open({ type: 'success', text: 'Item(s) sold successfully.' })
        this.removeItems(backpackIds)

        // TODO: settings
        this.close()
      } catch (e) {
        errorToast(e)
      } finally {
        this.selling = false
      }
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

  .invvalue {
    justify-content: flex-start !important;
  }
}

</style>
