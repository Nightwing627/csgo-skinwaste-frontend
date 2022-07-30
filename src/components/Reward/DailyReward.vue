<template>
  <v-row v-if="user" id="daily-reward">
    <v-col>
      <div class="font-weight-bold white--text">
        Daily Reward
      </div>
      <div>Your level is {{ user.level }}</div>
    </v-col>
    <v-col>
      <v-btn
        color="primary"
        block
        class="text-capitalize py-7"
        @click="getReward"
      >
        <span v-if="reward">
          <span v-if="time">Time left {{ timer }}</span>
          <span v-else>Collect ${{ reward.reward | currencyInt }}</span>
        </span>
        <span v-else>
          <span v-if="text"> {{ text }}</span>
        </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
import { rewards as api } from '@/api'
import { errorToast } from '@/utils'

export default {
  name: 'DailyReward',
  props: {
    user: {
      type: Object,
      default: () => undefined
    }
  },
  data() {
    return {
      reward: null,
      time: null,
      text: null,
      timer: null,
      intervalId: undefined
    }
  },
  watch: {
    time() {
      this.setTime()
    }
  },
  async mounted() {
    try {
      const response = await api.get()
      if (response.date) {
        this.time = response.date
      }
      if (response.reward === 0) {
        this.text = `Need level ${response.max + 1}`
        return
      }
      this.reward = response
    } catch (e) {
      if (e.code === 55) {
        this.text = 'Need level 10'
        return
      }
      errorToast(e)
    }
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    ...mapActions({
      getUser: 'user/getAuth'
    }),
    async getReward() {
      try {
        await api.claim()
        const response = await api.get()
        if (response.date) {
          this.time = response.date
        }
        await this.getUser()
      } catch (e) {
        errorToast(e)
      }
    },
    setTime() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }

      this.intervalId = setInterval(() => {
        const date = new Date(
          new Date(this.time).getTime()
            + 24 * 60 * 60 * 1000
            - new Date().getTime()
        )
        const hh = date.getUTCHours()
        const mm = date.getUTCMinutes()
        const ss = date.getUTCSeconds()
        this.timer = `${hh > 9 ? hh : `0${hh}`}:${mm > 9 ? mm : `0${mm}`}:${ss > 9 ? ss : `0${ss}`}`
      }, 1000)
    }
  }
}
</script>
