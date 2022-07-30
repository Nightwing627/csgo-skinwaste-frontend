<template>
  <div class="anim-ctn grey900 d-flex flex-center text--text">
    <!-- state: 0 -->
    <span v-if="game.state === 0" class="fw-bold caption text-uppercase">Waiting</span>

    <!-- state: 1 -->
    <v-progress-circular
      v-else-if="game.state === 1"
      color="primary" width="8" size="72" rotate="-90"
      :value="value"
    >
      <span class="fw-bold title">{{ timer }}</span>
    </v-progress-circular>

    <!-- state: not in [0,1] -->
    <div v-else class="frames-ctn" :class="{zoom: showWinner}">
      <img
        ref="frames"
        contain class="frames"
        :src="srcFile"
        @click="roll"
      >
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
// @TODO: Update sound file
// import { play } from '@/modules/sounds'

// ct: purple
import winnerCt from '@/assets/img/coinflip/ct_sprite.png'
// t: white
import winnerT from '@/assets/img/coinflip/t_sprite.png'

import { play as playSound } from '@/modules/sounds'

const FILES = {
  ct: winnerCt,
  t: winnerT
}

export default {
  name: 'CoinflipAnimation',
  props: {
    timer: {
      type: Number,
      default: 0
    },
    roundTimeLimit: {
      type: Number,
      default: 1
    },
    game: {
      type: Object,
      default: () => undefined
    },
    showWinner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rolling: false,
      rollAnim: null,
      srcFile: '',
      rolled: false
    }
  },
  computed: {
    value() {
      return (this.timer - 1) / this.roundTimeLimit * 100
    }
  },
  watch: {
    game: {
      async handler(game) {
        if (!game) {
          if (this.loading.cancel || this.closing) {
            return
          }

          this.close()
          this.$toast.open({ type: 'error', text: 'This game is no longer available.' })

          return
        }

        if (game.state > 1 && !this.rolled) {
          await this.$nextTick()
          this.roll(game.winner.extra.side)
        }

        if (game.state === 1 && game.rollingAt) {
          this.$emit('timer', game.rollingAt)
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.rollAnim) {
      this.rollAnim.kill()
    }
  },
  methods: {
    roll(side) {
      if (this.rolling || !side) {
        return
      }

      this.srcFile = FILES[side]

      const { frames } = this.$refs
      if (!frames) {
        return
      }

      this.rolling = true
      this.$emit('update:showWinner', false)

      const sheet = {
        width: 200,
        height: 200,
        total: 163,
        cols: 13,
        rows: 13,
        duration: 4.075
      }

      playSound('coinflip_roll', { volume: 0.3 })

      this.rollAnim = gsap.timeline({ force3D: true })

      // eslint-disable-next-line
      for (let i = 0; i <= sheet.total - 1; i++) {
        const step = i
        // if (side === 't') step += (sheet.total - 1)

        const x = (step % sheet.cols) * -sheet.width
        const y = Math.floor(step / sheet.cols) * -sheet.height
        const position = i / (sheet.total - 1) * sheet.duration

        this.rollAnim.set(frames, { x, y }, position)
      }

      // await new Promise(resolve => {
      const time = (sheet.duration * 1e3) - 1500

      setTimeout(() => {
        this.rolling = false
        this.rolled = true
        this.$emit('update:showWinner', true)

        // resolve(true)
      }, time)
      // })
    }
  }
}
</script>

.<style lang="scss">
$anim-ctn-size: 200px;
$anim-ctn-qty: 13;


.anim-ctn {
  overflow: hidden;
  width: $anim-ctn-size;
  height: $anim-ctn-size;
  border-radius: 50%;
  transform: translateY(50%);

  .frames-ctn {
    overflow: hidden;
    width: $anim-ctn-size;
    height: $anim-ctn-size;
    transition: none;
    // background-color: $grey700;

    &.zoom {
      transition: transform 0.5s 1s ease-in-out;
      transform: scale(1.2);
    }
  }

  .frames {
    width: #{$anim-ctn-size * $anim-ctn-qty};
  }
}

@media only screen and (max-width: 599px) {
  .anim-ctn {
    transform: none;
  }
}
</style>
