<template>
  <v-img
    rounded-circle
    :aspect-ratio="1"
    contain
    :class="className"
    :src="srcFile"
    :width="width"
    :max-width="maxWidth"
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
  name: 'CoinflipCoinAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '',
      validator: val => ['coin', 'sub'].includes(val)
    },
    side: {
      type: String,
      default: '',
      validator: val => ['', 'ct', 't'].includes(val)
    }
  },
  computed: {
    srcFile() {
      return FILES[this.src] || this.src
    },
    className() {
      const className = []

      if (this.type) {
        const map = {
          coin: 'coin mx-auto flex-no-grow',
          sub: 'sub-coin'
        }

        className.push(map[this.type])
      }

      if (this.side) {
        className.push(`side--${this.side}`)
      }

      return className
    },
    width() {
      if (this.type === 'coin') {
        return '80%'
      }

      return '100%'
    },
    maxWidth() {
      if (this.type === 'coin') {
        return 100
      }

      return 50
    }
  }
}
</script>
