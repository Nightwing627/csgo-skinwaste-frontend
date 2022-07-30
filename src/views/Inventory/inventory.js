import { mapActions, mapGetters, mapMutations } from 'vuex'
import sortBy from 'lodash.sortby'

import { errorToast } from '@/utils'

import { store as api } from '@/api'

import Inventory from '@/components/Inventory'

export default {
  name: 'MasterInv',
  components: {
    Inventory
  },
  metaInfo: {
    title: 'Sell Items'
  },
  data() {
    return {
      items: [],
      weaponTypes: [],
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
        const set = new Set()
        this.items = sortBy(val.map(i => {
          set.add(i.weapon)
          return { ...i, selected: false }
        }), 'price').reverse()
        this.weaponTypes = Array.from(set)
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
        // eslint-disable-next-line no-param-reassign
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
      } catch (e) {
        errorToast(e)
      } finally {
        this.selling = false
      }
    }
  }
}
