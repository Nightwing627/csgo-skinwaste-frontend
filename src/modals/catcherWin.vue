<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-title class="text--text mb-1 flex-center">
      EZ WIN!
    </v-card-title>
    <v-card-text>
      <div>
        <div class="text-center fw-bold secondary--text mt-4">
          You won {{ number | currencyInt }} with a {{ multiplier }}x!
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn text small @click="tweet(username, number, multiplier)">
        <fai :icon="['fab','twitter']" class="link mr-2 info--text" /> Share
      </v-btn>
      <v-btn text small @click="close">
        Close
      </v-btn>
    </v-card-actions>
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
      number: this.payload.number,
      multiplier: this.payload.multiplier,
      username: this.payload.username
    }
  },
  methods: {
    tweet(name, total, multiplier) {
      // `https://twitter.com/intent/tweet?text=Test%20my%20asshole%0Ahttp%3A%2F%2Flocalhost%3A8080%2F%23%2Freplay%2F517199&source=webclient`

      const coins = this.$options.filters.currencyInt(total)
      const text = encodeURIComponent(`${name} won ${coins} with a multiplier of ${multiplier}x! #SKINWASTE`)

      const url = `https://twitter.com/intent/tweet?text=${text}`
      window.open(url, '_blank', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600')
    }
  },
  metaInfo: {
    title: 'EZ Winnings'
  }
  // created() {
  //   if (!document.hasFocus()) {
  //     let counter = 0

  //     const sound = play('tradeReady', {
  //       loop: true,
  //       onend() {
  //         counter++
  //         if (counter === 2) sound.loop(false)
  //       }
  //     })
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
