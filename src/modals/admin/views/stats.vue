<template>
  <v-row class="mb-6">
    <v-col cols="12" class="grdey700 mb-md-n5">
      <v-row dense class="px-0">
        <v-col cols="12" md="4">
          <v-select
            v-model="statsOptions.points"
            attach
            :items="availableData"
            hide-details class="mb-md-2" multiple
            filled dense background-color="grey500"
            label="Main graph datasets"
          >
            <template v-slot:selection="{ item, index }">
              <span
                v-if="index === 1"
                class="body-2"
              >{{ statsOptions.points.length }} selected</span>
            </template>
          </v-select>
        </v-col>

        <v-col cols="12" md="5">
          <v-menu
            v-model="datepicker"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            left
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-row dense>
                <v-col class="py-0">
                  <v-text-field
                    v-model="statsOptions.range[0]"
                    label="Start date"
                    hide-details class="mb-md-2"
                    filled dense background-color="grey500"
                    readonly
                    v-on="on"
                  />
                </v-col>
                <v-col class="py-0">
                  <v-text-field
                    v-model="statsOptions.range[1]"
                    label="End date"
                    hide-details class="mb-md-2"
                    filled dense background-color="grey500"
                    readonly
                    v-on="on"
                  />
                </v-col>
              </v-row>
            </template>
            <v-date-picker
              v-model="statsOptions.range" color="primary"
              scrollable
              range
            />
          </v-menu>
        </v-col>

        <v-col cols="12" md="3">
          <v-btn
            class="full-height px-0" x-large block color="info"
            :loading="loading" depressed
            @click="refreshStats"
          >
            Get stats
          </v-btn>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="18/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="chartData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>

    <v-col cols="12" md="6">
      <h4 class="subtitle-1 mb-1 fw-bold primary--text">
        Wallet (USD): Balance vs Surplus
      </h4>
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="16/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="walletData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>

    <v-col cols="12" md="6">
      <h4 class="subtitle-1 mb-1 fw-bold primary--text">
        Transactions (USD): Deposited vs Withdrawn
      </h4>
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="16/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="transData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>


    <v-col cols="12" md="6">
      <h4 class="subtitle-1 mb-1 fw-bold primary--text">
        Games Volume
      </h4>
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="16/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="gameData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>

    <v-col cols="12" md="6">
      <h4 class="subtitle-1 mb-1 fw-bold primary--text">
        User Balance &amp; Inventory Value
      </h4>
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="16/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="userBalData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>


    <v-col cols="12" md="6">
      <h4 class="subtitle-1 mb-1 fw-bold primary--text">
        Expenses vs New Users vs Deposits
      </h4>
      <v-sheet color="grey700 pa-1 bdrd-2">
        <v-responsive :aspect-ratio="16/9">
          <v-progress-circular v-show="loading" class="loader" indeterminate />
          <LineChart v-show="!loading || stats" class="chart" :chart-data="expenseData" :options="chartOptions" />
        </v-responsive>
      </v-sheet>
    </v-col>

    <!-- <v-col cols="12" md="4" class="grey700">
      <v-select
        v-model="statsOptions.points"
        attach
        :items="availableData"
        hide-details class="mb-2" multiple
        filled dense background-color="grey500"
        label="Choose datasets"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 3" small color="grey300">
            <span>{{ item }}</span>
          </v-chip>
          <span
            v-if="index === 3"
            class="grey--text caption"
          >(+{{ statsOptions.points.length - 3 }} others)</span>
        </template>
      </v-select>
      <v-divider class="my-3" />
      <v-select
        v-model="statsOptions.grouping"
        attach
        :items="['day', 'week', 'month']"
        hide-details class="mb-2"
        filled dense background-color="grey500"
        label="Grouping"
      />

      <v-menu
        v-model="datepicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        left
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="statsOptions.range[1]"
            label="End date"
            hide-details class="mb-3"
            filled dense background-color="grey500"
            readonly
            v-on="on"
          />
          <v-text-field
            v-model="statsOptions.range[0]"
            label="Start date"
            hide-details class="mb-2"
            filled dense background-color="grey500"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="statsOptions.range" color="primary"
          scrollable
          range
        />
      </v-menu>

      <v-btn block color="secondary" :loading="loading" @click="refreshStats">
        Get stats
      </v-btn>
    </v-col> -->
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { admin as api } from '@/api'
import { errorToast } from '@/utils'

import LineChart from '../graph.vue'
import { JACKPOT_COLORS, PERMISSIONS } from '@/utils/constants'

const d = new Date()
const SEVEN_DAYS_AGO = d.setDate(d.getDate() - 7)

const curencyData = [
  'totalDepositsValue',
  'totalExpenses',
  'totalRakesValue',
  'totalWithdrawalsValue',
  'totalUserBalance',
  'totalItemValue',
  'totalMarkupValue',
  'walletBalance',
  'walletSurplus',
  'totalProfits',
  'totalRevenue',
  'totalAffiliateBalance'
]

export default {
  name: 'ModalAdminViewStats',
  components: {
    LineChart
  },
  data() {
    return {
      loading: false,
      stats: undefined,
      datepicker: false,
      statsOptions: {
        grouping: 'day',
        points: ['totalExpenses', 'totalRevenue', 'walletBalanceETH'],
        range: [
          new Date(SEVEN_DAYS_AGO).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'index',
          intersect: false
        }
      }
    }
  },
  created() {
    if (this.hasPermission(PERMISSIONS.VIEW_STATS)) this.refreshStats()
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    }),
    // HACK.. TODO: DRY this shit up
    chartData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = []

      this.statsOptions.points.forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => {
            if (!stats[key]) return 0

            if (curencyData.includes(key)) return (stats[key] / 100).toFixed(2)
            return stats[key]
          })
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    walletData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = [];

      ['walletBalance', 'walletSurplus'].forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => {
            if (!stats[key]) return 0
            return (stats[key] / 100).toFixed(2)
          })
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    transData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = [];

      ['totalDepositsValue', 'totalWithdrawalsValue'].forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => {
            if (!stats[key]) return 0
            return (stats[key] / 100).toFixed(2)
          })
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    gameData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = [];

      ['totalElite', 'totalSilver', 'totalCoinflips'].forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => (stats[key] || 0))
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    userBalData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = [];

      ['totalUserBalance', 'totalItemValue'].forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => {
            if (!stats[key]) return 0
            return (stats[key] / 100).toFixed(2)
          })
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    expenseData() {
      if (!this.stats) {
        return {
          label: [],
          datasets: []
        }
      }

      const datasets = [];

      ['totalExpenses', 'totalNewUsers', 'totalDepositsValue'].forEach((key, i) => {
        datasets.push({
          label: key,
          backgroundColor: `${JACKPOT_COLORS[i]}99`,
          borderColor: JACKPOT_COLORS[i],
          data: this.stats.map(stats => {
            if (!stats[key]) return 0

            if (curencyData.includes(key)) return (stats[key] / 100).toFixed(2)
            return stats[key]
          })
        })
      })


      return {
        labels: this.stats.map(i => i._id.replace('2020-', '')),
        datasets
      }
    },
    availableData() {
      if (!this.stats || !this.stats.length) return []

      return Object.keys(this.stats[0]).filter(i => i !== '_id')
    }
  },
  methods: {
    hasPermission(perm) {
      if (this.user && (this.user.permissions & perm || this.user.permissions & PERMISSIONS.SUPER_ADMIN)) return true
      return false
    },
    async refreshStats() {
      if (this.loading) return
      this.loading = true
      this.stats = null

      const { grouping, range: [start, end] } = this.statsOptions

      try {
        const data = await api.getStats(grouping, start, end)

        if (!data) return

        if (grouping === 'day') {
          const today = new Date(new Date().toISOString().split('T')[0])
          if (today >= new Date(start) && today <= new Date(end)) {
            const todayStats = await api.getDryRun()
            if (!todayStats) return

            todayStats._id = new Date().toISOString().split('T')[0]
            data.unshift(todayStats)
          }
        }

        this.stats = data.reverse()
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss">
  .chart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
