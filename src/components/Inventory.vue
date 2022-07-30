<template>
  <div
    v-if="!!itemSets.length && !loading"
    ref="inventory"
    class="inventory-ctn"
  >
    <RecycleScroller
      class="inventory-items"
      :items="itemSets"
      :item-size="rowHeight"
      @resize="onResize"
    >
      <div slot-scope="{ item }" class="item-row">
        <Item v-for="i in item.items" :key="i.backpackId || i._id" :data="i" @onClick="onClick" />
      </div>
    </RecycleScroller>
  </div>

  <div v-else-if="!loading" class="inventory-ctn no-items">
    <h3 class="title text-uppercase mb-4">
      No items found :(
    </h3>
  </div>

  <div v-else class="loaders disp-flex flex-center flex-wrap mx-n1">
    <div class="loading-text disp-flex flex-center-x">
      <v-progress-circular class="mr-4" color="primary" indeterminate size="32" />
      <h2 class="title">
        Loading
      </h2>
    </div>
    <v-skeleton-loader
      v-for="i in 25"
      :key="i"
      type="image"
      height="90"
      :width="(Math.random() * (30 - 10) + 10) + '%'"
      class="mx-1 mb-2 flex-grow"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import clamp from 'lodash.clamp'

import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import Item from '@/components/Item'

export default {
  name: 'ComponentInventory',
  components: {
    Item,
    RecycleScroller
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      debounce: null,
      itemsPerSet: 8,
      rowHeight: 250
    }
  },
  watch: {
    async items(val) {
      if (val && val.length) {
        await this.$nextTick()
        await this.$nextTick()
        await this.$nextTick()
        await this.$nextTick()
        this.resize()
      }
    }
  },
  computed: {
    ...mapGetters(['config']),
    itemSets() {
      if (!this.items || !this.items.length) return []

      const chunks = chunk(this.items, this.itemsPerSet)

      // prevent last row from sizing weirdly
      const lastChunk = chunks[chunks.length - 1]
      if (lastChunk.length < this.itemsPerSet) {
        while (lastChunk.length < this.itemsPerSet) {
          lastChunk.push({
            filler: true
          })
        }
      }

      return chunks.map((chunk, i) => ({
        id: i,
        items: chunk
      }))
    }
  },
  methods: {
    onResize() {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(() => {
        this.resize()
      }, 50)
    },
    resize() {
      if (!this.items || this.items.length < 1) return
      if (!this.$refs.inventory) return

      // get inventory width (inaccurate)
      const invWidth = this.$refs.inventory.offsetWidth

      const minItemSize = 145
      const marginPerItem = 10

      const itemsFitNM = Math.floor(invWidth / (minItemSize + marginPerItem))
      const itemsFit = Math.floor(invWidth / (minItemSize + marginPerItem) - itemsFitNM / 10) // first and last have half margin

      const itemsPerRow = clamp(itemsFit, 2, 13)
      this.itemsPerSet = itemsPerRow

      const marginPerRow = -55
      const itemSize = minItemSize + Math.floor((invWidth - itemsPerRow * minItemSize) / itemsPerRow - marginPerRow)

      // NOTE: image aspect ratio 1.2
      this.rowHeight = (itemSize / 1.2) + 10
    },
    // events
    onClick(item) {
      this.$emit('onItemClick', item)
    },
    onModalClose() {
      this.$emit('onModalClose')
    }
  }
}

function chunk(arr, n) {
  return arr.slice(0, ((arr.length + n - 1) / n) | 0).map((c, i) => arr.slice(n * i, n * i + n))
}
</script>

<style lang="scss" scoped>

.loaders {
  overflow: hidden;
  position: relative;
  height: 100%;

  .loading-text {
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::before {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to top, $grey900 10%, rgba($grey900, 0));
    content: ' ';
  }
}

.inventory-ctn {
  display: flex;
  flex-direction: column;

  .inventory-items {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
    width: 100%;
    height: 100%;
    will-change: transform;
  }
}

.inventory-ctn.no-items {
  color: rgba($text, 0.3);
}

.item-row {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  align-content: flex-start;
  width: 100%;
  margin: 5px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
