<template>
  <div
    class="game-info-ctn grey700 bdrd-1 lh-4 d-flex flex-wrap justify-space-around align-center align-content-center pa-2"
    style="flex: 1 0 auto;"
  >
    <template v-for="(item, i) in items">
      <RoundItem
        :key="i"
        :title="item.title"
        :content="item.content"
        :trunc="item.truncate"
      />
      <v-divider
        v-if="lastItem !== i && !$vuetify.breakpoint.smAndDown"
        :key="i + '-vertical'"
        inset
        vertical
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'RoundItems',
  components: {
    RoundItem: () => import('@/components/jackpot/RoundItem.vue')
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    lastItem() {
      return this.items.length - 1
    }
  }
}
</script>
