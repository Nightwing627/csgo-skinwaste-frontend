<template>
  <div v-if="item.skin && item.weapon">
    <div v-show="stattrak" class="caption fw-bold stattrak lh-1">
      StatTrak&trade;
    </div>

    <div class="caption fw-bold" :class="{'mb-3': stattrak}">
      {{ item.weapon }}
    </div>

    <div class="fw-bold" :style="{'color': item.color}">
      {{ item.skin }}
    </div>

    <div v-show="item.wear" class="grey100--text faded-8 caption">
      {{ item.wear }}
    </div>
  </div>
  <!-- <div v-else :style="{'font-size': '0.6rem'}">
    {{ item.market_name | truncate(75) }}
  </div> -->
</template>

<script>
export default {
  name: 'ItemName',
  props: {
    item: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    stattrak() {
      return this.item.market_name.includes('StatTrak')
    }
  }
}
</script>

<style lang="scss">
$stattrak: #cf6a32;

.item .stattrak {
  color: $stattrak !important;
}
</style>
