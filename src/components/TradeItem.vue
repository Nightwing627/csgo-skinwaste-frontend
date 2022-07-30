<template>
  <div class="trade-item grey300 d-flex flex-center-y px-3 py-2 bdrd-1 mb-2" :class="{failed: item.failed}">
    <v-img :src="item.image" class="flex-no-grow mr-4" width="124" />
    <div class="item-info lh-1-2">
      <div v-if="item.skin && item.weapon" class="mb-1">
        <div class="fw-semibold mb-2" :class="{'stattrak': stattrak}">
          <span v-show="stattrak">StatTrak&trade;</span>
          {{ item.weapon }}
        </div>
        <div class="fw-bold" :style="{'color': item.color}">
          {{ item.skin }}
        </div>
        <div v-show="item.wear" class="grey100--text faded-8 caption">
          {{ item.wear }}
        </div>
      </div>
      <div v-else class="mb-1" :style="{'color': item.color}">
        {{ item.market_name | truncate(75) }}
      </div>

      <div class="fw-semibold subtitle-2">
        <fai class="gold--text mr-2" :icon="['fas','coins']" />
        <span class="fw-bold text--text">{{ item.price | currencyInt }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const WEARS_SHORT = {
  'Factory New': 'FN',
  'Minimal Wear': 'MW',
  'Field-Tested': 'FT',
  'Well-Worn': 'WW',
  'Battle-Scarred': 'BS'
}

export default {
  name: 'ComponentTradeItem',
  props: {
    data: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    item() {
      const item = this.data
      if (item.color && !item.color.includes('#')) item.color = `#${item.color}`
      return item
    },
    wearShort() {
      if (!this.item.wear) return false
      return WEARS_SHORT[this.item.wear]
    },
    stattrak() {
      return this.item.market_name.includes('StatTrak')
    }
  }
}
</script>

<style lang="scss" scoped>
$stattrak: #cf6a32;

.stattrak {
  color: $stattrak !important;
}

.trade-item {
  background: linear-gradient(to right, $grey500, rgba($secondary, 0.1)) !important;

  &.failed {
    background: linear-gradient(to right, $grey500, rgba($primary, 0.1)) !important;
  }
}
</style>
