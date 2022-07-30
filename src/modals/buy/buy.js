import { mapMutations, mapGetters, mapActions } from 'vuex'
import sortBy from 'lodash.sortby'

import { store as api } from '@/api'

import Inventory from '@/components/Inventory'
import { errorToast } from '@/utils'

export default {
  needsAuth: true,
  name: 'ModalBuy',
  components: {
    Inventory
  },
  props: ['close', 'options'],
  data() {
    return {
      loading: false,
      purchasing: false,
      items: [],
      onlyShowAffordable: true,
      search: ''
    }
  },
  metaInfo: {
    title: 'Item Shop'
  },
  watch: {
    closeable(val) {
      this.$emit('update:options', { ...this.options, persistent: !val })
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    }),
    inventory() {
      let items = sortBy(this.items, 'price').reverse()

      if (this.user.balance !== 0 && this.onlyShowAffordable) {
        items = items.filter(i => i.price <= this.user.balance)
      }

      // TODO: settings / make better
      if (this.selectedValue) {
        items.forEach(i => {
          if (i.selected) {
            this.$set(i, 'disabled', false)
            // i.disabled = false
            return
          }

          this.$set(i, 'disabled', i.price >= (this.user.balance - this.selectedValue))

          // i.disabled = i.price >= (this.user.balance - this.selectedValue)
        })
      } else {
        items.forEach(i => {
          this.$set(i, 'disabled', false)
        })
      }

      if (this.search === '') return items
      return items.filter(i => i.market_name.toLowerCase().includes(this.search.toLowerCase()))
    },
    selected() {
      return this.items.filter(i => i.selected)
    },
    selectedValue() {
      return this.selected.reduce((acc, i) => acc + i.price, 0)
    }
  },
  async mounted() {
    this.getInventory()
    this.getAuth()
  },
  methods: {
    ...mapMutations({
      addItems: 'user/addItems',
      setBalance: 'user/setBalance'
    }),
    ...mapActions({
      getAuth: 'user/getAuth'
    }),
    async getInventory() {
      if (this.loading) return
      this.loading = true

      try {
        const inventory = await api.get()
        this.items = sortBy(inventory.map(i => ({ ...i, selected: false })), 'price').reverse()
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading = false
      }
    },
    async buy() {
      if (this.purchasing) return
      if (!this.selected.length) return
      this.purchasing = true

      try {
        const { balance } = await api.buy(this.selected.map(i => i._id))
        this.setBalance(balance)

        this.$toast.open({ type: 'success', text: 'Successfully purchased item(s)' })
      } catch (e) {
        errorToast(e)
      } finally {
        this.purchasing = false
      }
    },
    selectItem(item) {
      if (this.loading) return
      if (this.purchasing) return

      const val = !item.selected
      // eslint-disable-next-line no-param-reassign
      item.selected = val
    }
  }
}
