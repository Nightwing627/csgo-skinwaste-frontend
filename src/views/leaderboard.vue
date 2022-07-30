<template>
  <div class="container leaderboard-container">
    <div class="d-flex border-b align-items-center pb-2">
      <h3 class="ml-2">
        Leaderboard
      </h3>
      <div class="flex-end align-items-center justify-center">
        <div
          class="button"
          :class="{ active: !isWeekly }"
          @click="getMonthlyLeaderboard"
        >
          Month
        </div>
        <div
          class="button"
          :class="{ active: isWeekly }"
          @click="getWeeklyLeaderboard"
        >
          Week
        </div>
      </div>
    </div>

    <div class="leaderboard">
      <div
        v-for="(user, index) in top3"
        :key="user.user_id"
        :class="`leaderboard-${index + 1}`"
        style="display: block;"
      >
        <div class="leaderboard-avatar">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            class="circle-img circle-img--small mr-2"
          >
        </div>
        <div class="leaderboard-username">
          <div v-if="user.username" class="text-wrap">
            {{ user.username }}
          </div>
        </div>
        <div class="leaderboard-reward">
          <div v-if="user.amount" class="leaderboard-reward-value">
            {{ formatCurrency(user.amount) }}
          </div>
          <div class="d-flex align-items-baseline justify-center">
            <fai
              v-if="user.reward"
              :icon="['fas', 'dollar-sign']"
              class="mr-1 icon leading-none text-purple"
              style="margin: auto 0;"
            />
            <h4 v-if="user.reward" class="mr-1">
              {{ formatCurrency(user.reward) }}
            </h4>
          </div>
        </div>
      </div>
    </div>
    <div class="podeum" />

    <h4 v-if="leaderboardUsers.length > 0" class="text-center others">
      Other Users
    </h4>

    <table v-if="leaderboardUsers.length > 0" class="table">
      <tbody>
        <tr v-for="(user, index) in leaderboardUsers" :key="user.user_id">
          <td class="w-2">
            <div class="d-flex align-items-center justify-center border-r-1">
              {{ index + 4 }}
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center" stlye="padding: 0.75rem;">
              <img
                :src="user.avatar"
                class="circle-img circle-img--small mr-2"
              >
              <div class="user-info__basic">
                <h4 v-if="user.username" class="mb-0 text-wrap">
                  {{ user.username }}
                </h4>
              </div>
            </div>
          </td>
          <td class="w-5">
            <div
              v-if="user.amount"
              class="d-flex align-items-center justify-space"
            >
              <div class="leaderboard-reward-value mr-2">
                {{ formatCurrency(user.amount) }}
              </div>
              <div class="d-flex align-items-baseline justify-center">
                <fai
                  :icon="['fas', 'dollar-sign']"
                  class="mr-1 icon leading-none text-purple"
                  style="margin: auto 0;"
                />
                <h4 class="mr-1">
                  {{ formatCurrency(user.reward) }}
                </h4>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { leaderboard as api } from '@/api'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'

  // These options are needed to round to whole numbers if that's what you want.
  // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})
export default {
  data() {
    return {
      leaderboardUsers: [],
      top3: [{}, {}, {}],
      isLoaded: false,
      isWeekly: false
    }
  },
  async created() {
    this.getMonthlyLeaderboard()
  },
  methods: {
    formatCurrency(value) {
      return formatter.format(value / 100).slice(1)
    },
    async getMonthlyLeaderboard() {
      this.isLoaded = false
      const leaderboard = await api.getMonthly()
      if (leaderboard.error || leaderboard.errors) return
      this.leaderboardUsers = leaderboard.leaderboardUsers
      this.top3 = this.leaderboardUsers.slice(0, 3)
      if (this.top3.length < 3) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i <= 3 - this.top3.length; i++) { this.top3.push({ _id: i }) }
      }
      this.leaderboardUsers = this.leaderboardUsers.slice(3)
      this.isLoaded = true
      this.isWeekly = false
    },
    async getWeeklyLeaderboard() {
      this.isLoaded = true
      const leaderboard = await api.getWeekly()
      if (leaderboard.error || leaderboard.errors) return
      this.leaderboardUsers = leaderboard.leaderboardUsers
      this.top3 = this.leaderboardUsers.slice(0, 3)
      if (this.top3.length < 3) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i <= 3 - this.top3.length; i++) { this.top3.push({ _id: i }) }
      }
      console.log(this.top3)
      this.leaderboardUsers = this.leaderboardUsers.slice(3)
      this.isLoaded = false
      this.isWeekly = true
    }
  }
}
</script>

<style lang="scss">
.leaderboard-container {
  max-width: 1225px;

  .align-items-center {
    -ms-flex-align: center !important;
    -webkit-box-align: center !important;
    align-items: center !important;
  }

  .border-b {
    border-bottom: 1px solid #eaeaea7c;
  }

  .border-r-1 {
    border-right: 2px solid $grey100;
    padding: 0.65rem 0.5rem 0.65rem 0;
  }

  .button {
    background-color: #3b4453;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    font-size: 16px;
    opacity: 0.6;
    padding: 14px 28px;
  }

  .button.active {
    opacity: 1;
  }

  .container-max-width img {
    background-color: #afafaf;
  }

  .d-flex {
    display: flex !important;
  }

  .flex-end {
    margin-left: auto;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-space {
    justify-content: space-around;
  }

  .text-wrap {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .leaderboard {
    align-items: center;
    display: flex;
    justify-content: center;
    // margin-left: 1rem;
    position: relative;
    max-width: 800px;
    margin: auto;
  }

  .leaderboard > * {
    display: none;
    flex-basis: 20%;
    min-height: 165px;
    position: relative;
    text-align: center;
    min-width: 28%;
    max-width: 28%;
  }

  .leaderboard-1 {
    color: #f6c26d;
    fill: #f6c26d;
    font-size: 16px;
    order: 2;
    position: relative;
    transform: translateY(6%);
    min-width: 42%;
    max-width: 42%;
  }

  .leaderboard-2 {
    color: #8f8888;
    fill: #696969;
    order: 1;
    position: relative;
    transform: translateY(48%);
    min-width: 30%;
    max-width: 30%;
  }

  .leaderboard-3 {
    color: #c86730;
    fill: #c86730;
    order: 3;
    position: relative;
    transform: translateY(58);
  }

  .leaderboard-avatar img {
    border-radius: 100%;
    height: 50px;
    margin-bottom: 5px;
    margin-top: 20px;
    overflow: hidden;
    padding: 2px;
    width: 50px;
  }

  .leaderboard-username {
    font-size: 20px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .leading-none {
    line-height: 1;
  }

  .mr-2,
  .mx-2 {
    margin-right: 0.5rem !important;
  }

  .others {
    border-top: 1px solid #eaeaea7c;
    font-size: 1.6rem;
    padding: 1rem;
  }

  .pb-2 {
    padding-bottom: 1rem;
  }

  .podeum {
    background: url(/img/leaderboard/podeum.svg) no-repeat center;
    background-size: contain;
    margin-bottom: 0.4rem;
    min-height: 20vh;
    max-width: 800px;
    margin: auto;
  }

  .table {
    background-color: transparent;
    border-collapse: separate;
    border-spacing: 0 8px;
    margin-bottom: 1rem;
    max-width: 100%;
    width: 100%;
  }

  .table tbody tr td {
    background: $grey400;
  }

  .table tbody tr td:last-child {
    border-radius: 0 5px 5px 0;
  }

  .table tbody tr td:nth-child(1) {
    border-radius: 5px 0 0 5px;
  }

  .table td,
  .table th {
    border-top: 1px solid $grey400;
    // padding: 0.75rem;
    vertical-align: top;
  }

  .table thead tr th,
  .table thead tr td,
  .table tbody tr th,
  .table tbody tr td {
    border: none;
    vertical-align: middle;
  }

  .text-purple {
    color: #9c97ff;
  }

  .w-2 {
    padding: 0.35rem;
    width: 6rem;
  }

  .w-5 {
    padding: 0.35rem;
    width: 10rem;
  }

  img.circle-img {
    border-radius: 70px;
    box-shadow: 0 2px 5px #000;
    height: 70px;
    width: 70px;
  }

  img.circle-img.circle-img--small {
    border-radius: 55px;
    height: 55px;
    width: 55px;
  }

  img.circle-img.purple-circle {
    border: 2px solid #9c97ff;
  }

  @media screen and (max-width: 1045px) {
    .leaderboard-1 {
      transform: translateY(5%);
    }

    .leaderboard-2 {
      transform: translateY(48%);
    }

    .leaderboard-3 {
      transform: translateY(60%);
    }
  }

  @media screen and (max-width: 576px) {
    .leaderboard-1 {
      transform: translateY(15%);
    }

    .leaderboard-2 {
      transform: translateY(36%);
    }

    .leaderboard-3 {
      transform: translateY(42%);
    }
  }
}
</style>
