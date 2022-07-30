<template>
  <v-row class="game" @click="toggleBottomContainer(game.pf)">
    <v-col cols="12" lg="10" class="caption">
      <RoundItems :items="items" />
    </v-col>


    <v-col cols="12" lg="2" class="text-center caption cursor-pointer">
      <v-btn block color="grey700" class="caption py-7" @click="verify(game.pf)">
        <fai :icon="['fas', 'check']" class="mr-2" />VERIFY ROUND
      </v-btn>
    </v-col>

    <v-slide-y-transition>
      <v-col v-if="displayVerification" cols="12" class="caption">
        <RoundItems :items="extras" />
      </v-col>
    </v-slide-y-transition>
  </v-row>
</template>

<script>
import { createHash } from 'crypto'
import Chance from 'chance'

export default {
  name: 'RoundInfo',
  components: {
    RoundItems: () => import('@/components/jackpot/RoundItems.vue')
  },
  props: {
    game: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      ticket: 0,
      winningMod: 0,
      generatedHash: '',
      displayVerification: false
    }
  },
  computed: {
    items() {
      return [
        { title: 'Game Id', content: `#${this.game.roundId}` },
        { title: 'Hash', content: this.game.pf.hash, truncate: 32 },
        { title: 'Server Seed', content: this.game.pf.seed },
        { title: 'Ticket', content: (this.game.pf.ticket * 100).toFixed(6) }
      ]
    },

    extras() {
      return [
        { title: 'Roll', content: this.ticket },
        { title: 'Ticket', content: this.winningMod },
        { title: 'Game Hash', content: this.generatedHash, truncate: 32 }
      ]
    }
  },
  methods: {
    toggleBottomContainer(pf) {
      if (this.displayVerification) {
        this.displayVerification = false
        return
      }
      const { seed, randomHash: random, total: pot } = pf
      const generatedHash = createHash('sha256').update(seed).digest('hex')
      const chanceHash = `${seed}-${random}`.trim()
      const percentage = new Chance(chanceHash).floating({ min: 0, max: 100, fixed: 6 }) / 100
      const ticket = (pot * percentage).toFixed(7)

      this.ticket = ticket
      this.winningMod = percentage
      this.generatedHash = generatedHash
      this.displayVerification = true
    },
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.seed}","random":"${pf.randomHash}","pot":${pf.total}}`
      const win = window.open(url, '_blank')
      win.focus()
    }
  }
}
</script>

<style lang="scss">
.game{
  cursor: pointer;
}

.game-info-ctn {
  > div {
    height: 40px;
    word-spacing: -1px;
  }

  > hr {
    border-color: $grey300 !important;
  }

  [aria-orientation="horizontal"] {
    border-color: $grey300 !important;
    width: 100%;
  }
}
</style>
