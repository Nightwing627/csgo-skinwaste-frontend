<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-title class="text--text">
      Trade Offer Ready
    </v-card-title>
    <v-card-text>
      <p class="body-2">
        One of your trade offers is ready. Please accept it as soon as possible before it expires.
        In case you do not get your item for any reason (decline, expire, etc), you will be automatically refunded shortly.
      </p>

      <v-btn
        block class="mt-3 mb-2"
        x-large color="secondary" target="_blank"
        :href="`https://steamcommunity.com/tradeoffer/${id}/`"
      >
        Open Trade Offer
      </v-btn>

      <v-btn block class="mb-3" color="grey300" @click="close">
        Close
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { play } from '../modules/sounds'

export default {
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
      id: this.payload.id
    }
  },
  metaInfo: {
    title: 'CSGO Trade Sent'
  },
  created() {
    if (!document.hasFocus()) {
      let counter = 0

      const sound = play('tradeReady', {
        loop: true,
        onend() {
          counter++
          if (counter === 2) sound.loop(false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
