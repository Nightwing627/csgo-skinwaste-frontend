<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-title class="text--text mb-1 flex-center">
      Trade Summary
    </v-card-title>
    <v-card-text>
      <div v-if="success.length">
        <div class="success fw-bold bdrd-1 pa-3 mb-2">
          {{ success.length }} item(s) are on their way
        </div>
        <TradeItem v-for="item in success" :key="item._id" :data="item" />
        <div class="text-center fw-bold secondary--text mt-4">
          You will receive notifications for each trade.
        </div>
        <div class="text-center mb-4">
          The site will play a sound if you are tabbed out, please <b>do not mute</b> the website.
        </div>
      </div>

      <div v-if="failed.length">
        <div class="primary fw-bold grey900--text bdrd-1 pa-3 mb-2">
          {{ failed.length }} item(s) errored and have been refunded
        </div>
        <TradeItem v-for="item in failed" :key="item._id" :data="item" />
      </div>
    </v-card-text>
    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn text small @click="close">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TradeItem from '@/components/TradeItem'

export default {
  components: {
    TradeItem
  },
  props: {
    close: {
      type: Function,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    payload: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      items: this.payload.items
    }
  },
  metaInfo: {
    title: 'CSGO Trade Summary'
  },
  computed: {
    success() {
      return this.items.filter(i => !i.failed)
    },
    failed() {
      return this.items.filter(i => i.failed)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
