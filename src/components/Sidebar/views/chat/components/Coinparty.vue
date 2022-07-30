<template>
  <div v-if="$store.state.coinparty.active" class="coinparty">
    <v-card elevation="6" outlined tile class="mx-4 mt-2 bg-transparent">
      <v-badge color="primary" icon="mdi-help" overlap>
        <v-card-text style="margin-top: 0.6em;">
          <v-row align="center">
            <v-col cols="8">
              <v-list-item-title class="text-h5 gold-text">
                Coin Party
              </v-list-item-title>
              <v-row class="text-h2 text-subtitle-1 my-1">
                <span>
                  <b class="inline">{{
                    this.$store.state.coinparty.coinparty.initiator
                  }}</b>
                  threw a coin party!
                </span>
                <div>
                  Click to join!
                  <span
                    class="gold-text"
                  >(${{
                    parseFloat(
                      this.$store.state.coinparty.coinparty.balance / 100
                    ).toFixed(2)
                  }})</span>
                </div>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-img
                src="/img/coinparty/chest.png"
                alt="CoinParty image"
                width="92"
                style="margin-left:auto;"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <div class="timer">
          {{ dateLeft }}
        </div>
        <form v-if="svg" class="captcha" @submit.prevent="solved">
          <div class="disp-flex">
            <div v-html="svg" />
            <v-icon
              @click="recaptcha"
            >
              mdi-refresh
            </v-icon>
          </div>
          <div class="form__group field">
            <v-text-field
              v-model="solution"
              label="Enter code here"
              :rules="rules"
              hide-details="auto"
              autocomplete="off"
              class="mx-2 mb-3"
            />
          </div>
        </form>
        <button
          v-if="!svg"
          class="mx-2 mb-2 btnn"
          :disabled="this.$store.state.coinparty.joined"
          @click="recaptcha"
        >
          <span v-if="this.$store.state.coinparty.joined">Joined!</span>
          <span v-else>Claim <b>FREE</b> coins</span>
        </button>
      </v-badge>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import axios from '@/modules/axios'
import { user as api } from '@/api'

export default {
  data() {
    return {
      time: 0,
      dateLeft: '',
      svg: '',
      svgID: '',
      solution: '',
      isValid: true,
      rules: [
        value => this.isValid || 'Invalid captcha',
        value => !!value || 'Required.'
      ],
      timer: null
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      inventory: 'user/inventory'
    })
  },
  watch: {
    '$store.state.coinparty.active': {
      async handler(val, oldVal) {
        if (!val) {
          this.setUser(await api.get())
          clearInterval(this.timer)
        }
      },
      deep: true
    }
  },
  updated() {
    this.$nextTick(() => {
      if (
        this.$store.state.coinparty.coinparty.participants.includes(
          this.user._id
        )
      ) {
        this.$store.commit('coinparty/setIsJoined', true)
      }
    })
  },
  mounted() {
    this.timer = setInterval(() => {
      if (!this.$store.state.coinparty.active) return
      this.time = new Date(
        new Date(this.$store.state.coinparty.coinparty.date).getTime()
            + this.config.coinparty.timeLimit * 1000
      )

      const now = new Date().getTime()
      const timeleft = this.time - now

      const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeleft % (1000 * 60)) / 1000)
      if (minutes <= 0) {
        if (seconds <= 0) {
          this.dateLeft = '00:00'
          clearInterval(this.timer)
        }
      }
      this.dateLeft = `${minutes <= 9 ? `0${minutes}` : minutes}:${
        seconds <= 9 ? `0${seconds}` : seconds
      }`
    }, 1000)
  },
  methods: {
    ...mapActions({
      join: 'coinparty/join'
    }),
    ...mapMutations({ setUser: 'user/setUser' }),
    async recaptcha(e) {
      if (!e.isTrusted) return
      const resp = await axios.get('/captcha')
      this.svg = resp.svg
      this.svgID = resp._id
    },
    async solved(e) {
      if (!e.isTrusted) return
      const resp = await axios.post('/captcha/validate', {
        _id: this.svgID,
        text: this.solution
      })

      this.solution = ''

      if (resp.error || !resp.captcha) {
        this.isValid = false
        return
      }
      this.isValid = true
      this.svg = ''
      this.svgID = ''
      this.join()
      console.log(this.$store.state.coinparty)
    }
  }
}
</script>

<style lang="scss">
.coinparty {
  --size-bezel: 0.5rem;
  --size-radius: 4px;
  .v-card {
    background-color: rgba($grey400, 0.5) !important;
    border-radius: 5px;
    .v-badge--icon {
      .v-badge__badge {
        width: 28px;
        height: 28px;
        border-radius: 32px;
      }
    }
    .v-badge__badge {
      .v-icon {
        font-size: 18px;
      }
    }
    .v-card__subtitle,
    .v-card__text,
    .v-card__title {
      padding: 0 16px;
    }
    .btnn {
      width: calc(100% - 16px);
      padding: 10px 0;
      border-radius: 5px;
      font-size: 14px;
      background-color: $primary;
      transition: background 0.3s ease;
      &:hover {
        background-color: rgba($primary, 0.8) !important;
      }
      &:disabled {
        background-color: rgba($secondary, 0.5) !important;
      }
    }
    .text-subtitle-1 {
      color: rgba($text, 0.8) !important;
      font-size: 0.9em !important;
      padding-right: 0 !important;
      padding-left: 0.85em !important;
      line-height: 1.25em;
    }
    .inline {
      display: inline-block !important;
    }
    .timer {
      position: absolute;
      top: 0.8em;
      right: 0.5em;
      font-size: 0.8em;
      color: rgba($text, 0.8);
    }
    .captcha {
      .disp-flex {
        justify-content: center;
        position: relative;
        left: 50%;
        border-radius: 5px;
        transform: translateX(-50%);
      }
    }
    .gold-text {
      color: #ffbc03;
    }
  }
}
</style>
