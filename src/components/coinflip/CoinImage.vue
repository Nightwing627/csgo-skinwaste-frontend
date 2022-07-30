<template>
  <v-img
    class="rounded-circle"
    :aspect-ratio="1"
    contain
    :src="srcFile"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import coinflipT from '@/assets/img/coinflip/t.png'
import coinflipCt from '@/assets/img/coinflip/ct.png'

const FILES = {
  t: coinflipT,
  ct: coinflipCt
}

export default {
  name: 'CoinflipCoin',
  props: {
    type: {
      type: String,
      default: '',
      validator: val => ['ct', 't'].includes(val)
    }
  },
  computed: {
    srcFile() {
      return FILES[this.type]
    }
  }
}
</script>
