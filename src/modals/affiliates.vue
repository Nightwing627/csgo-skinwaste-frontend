
<template>
  <v-card class="modal grey900 bdrd-3 ma-0">
    <v-card-title class="text--text flex-between-x flex-center-y">
      <h2 class="title">
        Affiliates
      </h2>

      <v-btn
        color="grey100"
        text small class="fw-bold"
        :disabled="loading.stats"
        @click="getStats"
      >
        <fai class="mr-2" :spin="loading.stats" :icon="['fas','sync']" />
        Refresh
      </v-btn>
    </v-card-title>

    <v-card-text class="grey900 grey100--text">
      <p class="body-2 mb-6">
        Earn free coins by referring your friends/fans to Skinwaste!
        By using your code, they will receive a
        <span class="primary--text fw-bold">bonus of {{ Math.round(config.affiliate.referralDepositBonus * 100) }}%</span>
        on <em>every</em> deposit. In return, you receive a portion of each bet they make<sup>*</sup>.
      </p>


      <div v-if="affiliates !== undefined">
        <v-row v-if="affiliates" class="mb-6">
          <v-col cols="6" sm="4" class="text-center">
            <div class="headline">
              <fai class="primary--text mr-1" :icon="['fas', 'users']" />
              {{ affiliates.totalUsersReferred }}
            </div>
            <div class="caption text-uppercase fw-bold">
              Users referred
            </div>
          </v-col>
          <v-col cols="6" sm="4" class="text-center">
            <div class="headline">
              <fai class="primary--text mr-1" :icon="['fas', 'funnel-dollar']" />
              {{ affiliates.referralDeposits }}
            </div>
            <div class="caption text-uppercase fw-bold">
              which deposited
            </div>
          </v-col>
          <v-col cols="12" sm="4" class="text-center">
            <div class="headline">
              <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
              {{ affiliates.referralsWagered | currencyInt }}
            </div>
            <div class="caption text-uppercase fw-bold">
              Total Wagered
            </div>
          </v-col>
        </v-row>

        <v-card v-if="affiliates && affiliates.elite" class="pa-3 mb-3 elite" flat>
          <h4 class="subtitle-1 fw-bold mb-2">
            <fai icon="crown" class="mr-1 gold--text " />
            Elite Affiliate
          </h4>
          <p class="body-2 lh-1-2 mb-0">
            On top of your affiliate tier, you also earn
            <span class="gold--text fw-bold">{{ (config.affiliate.elite.percent_rake * 100).toFixed(2) }}%</span>
            of our rake* when your referred user <b>wins</b> a game.
          </p>
        </v-card>

        <v-card v-if="affiliates" color="grey700" class="pa-3 mb-3" flat>
          <h4 class="subtitle-1 fw-bold primary--text">
            You are a tier {{ affiliates.level }} affiliate
          </h4>
          <p v-if="level < 10" class="body-2 lh-1 mb-3">
            You need {{ nextLevel.users }} more users or
            <span class="no-wrap mx-1">
              <fai class="gold--text" :icon="['fas', 'coins']" />
              {{ nextLevel.wagered | currencyInt }}
            </span>

            more wagered to level up.
          </p>
          <p v-else class="body-2 lh-1 mb-0">
            That's it, you're the highest tier! Congrats and enjoy the coins ;)
          </p>
          <v-progress-linear
            v-if="level < 10"
            striped class="bdrd-0" :value="nextLevel.progress.value"
            height="10" :min="nextLevel.progress.min"
          />
        </v-card>

        <v-card v-if="affiliates" color="grey700" class="mb-3 px-3 disp-flex flex-center-y flex-between-x" flat>
          <v-row align="center">
            <v-col cols="12" sm="7" class="pb-0 pb-sm-3">
              <h4 class="subtitle-2 fw-bold primary--text">
                Cashout Earnings
              </h4>
              <p class="body-2 mb-0">
                Your referrals have earned you
                <span class="no-wrap">
                  <fai class="gold--text ml-1" :icon="['fas', 'coins']" />
                  {{ affiliates.earnings | currencyInt }}
                </span>
                so far.
              </p>
            </v-col>
            <v-col class="d-flex">
              <v-btn
                large
                color="secondary700"
                :ripple="false"
                class="fw-bold flex-grow"
                :loading="loading.withdraw"
                :disabled="affiliates.balance < 1"
                @click="withdraw"
              >
                <span class="mr-2">Cashout</span>
                <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                {{ affiliates.balance | currencyInt }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>


        <v-card color="grey700" class="pa-3 mb-3" flat>
          <h4 class="subtitle-2 fw-bold primary--text">
            Your Affiliate Code
          </h4>
          <v-text-field
            v-model="localCode" class="mb-1"
            hide-details solo dense filled
            :readonly="!editingCode"
            placeholder="Enter the code you'd like"
            flat background-color="grey500"
          >
            <template v-slot:append>
              <!-- <fai
                v-show="!editingCode"
                class="primary--text faded-8 mr-3 link"
                :icon="['fab', 'twitter']" @click="twitterShare"
              /> -->
              <fai
                v-show="affiliates"
                class="grey100--text faded-8 link"
                :icon="['fas', editingCode ? 'times' : 'pencil']" @click="editCode"
              />
            </template>

            <template v-slot:append-outer class="pa-0">
              <v-btn
                v-show="editingCode"
                color="secondary"
                :ripple="false"
                class="ml-2 flex-grow unheight fw-bold"
                :loading="loading.code"
                @click="setCode"
              >
                {{ affiliates ? 'Change' : 'Become an affiliate' }}
              </v-btn>
            </template>
          </v-text-field>

          <div v-if="affiliates" class=" mt-3">
            <h4 class="subtitle-2 fw-bold primary--text">
              Your Code URL
            </h4>
            <v-text-field
              :value="url" class="mb-1"
              hide-details solo dense filled
              readonly flat background-color="grey500"
            >
              <template v-slot:append-outer class="pa-0">
                <v-btn
                  color="secondary"
                  :ripple="false"
                  class="ml-2 flex-grow unheight fw-bold"
                  @click="copyUrl"
                >
                  Copy
                </v-btn>
              </template>
            </v-text-field>
          </div>
        </v-card>
      </div>
      <v-skeleton-loader v-else type="paragraph" />


      <h3 class="title mt-5">
        Tiers
      </h3>
      <p>
        The more referrals you have, the higher your level, which gives you an even bigger cut.
        To level up, you must meet at least one of the criterias.
      </p>
      <div
        v-for="(tier, i) in config.affiliate.tiers" :key="i"
        class="grey700 tier-list-item disp-flex flex-center-y pa-3 mb-1"
      >
        <div class="fw-bold mr-1 mr-sm-6 tier-title primary--text" style="min-width: 50px;">
          Tier {{ i }}
        </div>
        <div class="tier-text">
          <div class="overline lh-1 faded-8 text-uppercase fw-bold">
            Criterias
          </div>
          {{ tier.user || 0 }} users <span class="light--text">or</span> {{ tier.wagered | currencyInt }} wagered
        </div>
        <v-spacer />
        <div class="text-center">
          <span class="fw-black gold--text">
            {{ (tier.bonus * 100).toFixed(2) }}%
          </span>
          <div class="overline lh-1 faded-8 text-uppercase fw-bold">
            Cut
          </div>
        </div>
      </div>

      <v-divider class="my-3" />

      <div

        class="tier-list-item disp-flex flex-center-y pa-3 mb-1 elite"
      >
        <div class="fw-bold mr-1 mr-sm-6 tier-title " style="min-width: 50px;">
          <fai icon="crown" class="mr-1 gold--text " />
          Elite
        </div>
        <div class="tier-text">
          Sponsorship tier
        </div>
        <v-spacer />
        <div class="text-center">
          <span class="fw-black gold--text">
            {{ (config.affiliate.elite.percent_rake * 100).toFixed(2) }}%
          </span>
          <div class="overline lh-1 faded-8 text-uppercase fw-bold">
            Cut
          </div>
        </div>
      </div>


      <div class="overline faded-8 mt-6">
        *Cuts are only credited if Skinwaste was able to take rake from the game.
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn
        small text :ripple="false"
        class="px-2 fw-bold"
        :disabled="loading.code"
        @click="close"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable no-debugger */
import { mapGetters, mapActions } from 'vuex'
import { errorToast } from '@/utils'

const affToTerm = {
  user: 'totalUsersReferred',
  wagered: 'referralsWagered'
}

export default {
  needsAuth: true,
  name: 'ModalAffiliates',
  props: ['close', 'options'],
  data() {
    return {
      editingCode: false,
      localCode: null,
      //
      loading: {
        code: false,
        stats: false,
        withdraw: false
      }
    }
  },
  metaInfo: {
    title: 'Affiliates'
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser',
      affiliates: 'user/affiliates'
    }),
    level() {
      if (!this.affiliates || !this.affiliates.level) return 1
      // return this.affiliates.levelOverride || this.affiliates.level
      return this.affiliates.level
    },
    nextLevel() {
      if (!this.affiliates) return {}
      const { tiers } = this.config.affiliate
      const nextLevel = this.level === 10 ? 10 : this.level + 1

      const progresses = ['user', 'wagered'].map(term => {
        const min = tiers[this.level][term]
        const max = tiers[nextLevel][term]
        const val = this.affiliates[affToTerm[term]]
        return {
          min,
          max,
          value: ((val - min) * 100) / (max - min)
        }
      })

      return {
        level: nextLevel,
        users: tiers[nextLevel].user - this.affiliates.totalUsersReferred,
        wagered: tiers[nextLevel].wagered - this.affiliates.referralsWagered,
        progress: progresses.sort((a, b) => b.value - a.value)[0]
      }
    },
    url() {
      if (!this.affiliates || !this.affiliates.code) return ''
      return `${document.location.origin}/?ref=${this.affiliates.code}`
    }
  },
  watch: {
    loading: {
      handler(val) {
        this.$emit('update:options', { ...this.options, persistent: Object.values(val).some(i => i) })
      },
      deep: true
    },
    'affiliates.code': {
      handler(val, old) {
        if (!old && val) this.getStats()
      },
      deep: true
    }
  },
  async created() {
    try {
      await this.getStats()
    } catch {}
  },
  methods: {
    ...mapActions({
      setAffiliateCode: 'user/setAffiliateCode',
      getAffiliateStats: 'user/getAffiliateStats',
      withdrawAffBalance: 'user/withdrawAffiliate'
    }),
    editCode() {
      this.editingCode = !this.editingCode
      if (!this.editingCode) this.localCode = this.affiliates.code
    },
    async getStats() {
      if (this.loading.stats) return
      this.loading.stats = true

      try {
        await this.getAffiliateStats()

        if (!this.affiliates) this.editingCode = true
        else this.localCode = this.affiliates.code
      } catch {} finally {
        this.loading.stats = false
      }
    },
    async setCode() {
      if (!this.localCode) return
      if (this.loading.code) return
      this.loading.code = true

      try {
        await this.setAffiliateCode(this.localCode)

        this.editingCode = false
        if (!this.editingCode) this.localCode = this.affiliates.code

        this.$toast.open({ type: 'success', text: 'Your code has been changed' })
      } catch {} finally {
        this.loading.code = false
      }
    },
    async withdraw() {
      if (this.affiliates.balance < 1) return
      if (this.loading.withdraw) return
      this.loading.withdraw = true

      try {
        await this.withdrawAffBalance(this.affiliates.balance)
        this.$toast.open({ type: 'success', text: 'Cashed out affiliate balance successfully.' })
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.withdraw = false
      }
    },
    async copyUrl() {
      if (!navigator.clipboard) {
        this.$toast.open({ type: 'error', text: 'Your browser doesn\'t support this feature.' })
        return
      }

      try {
        await navigator.clipboard.writeText(this.url)
        this.$toast.open({ type: 'success', text: 'Link copied' })
      } catch (err) {
        console.error('Failed to copy!', err)
        this.$toast.open({ type: 'error', text: 'Couldn\'t copy, sorry.' })
      }
    },
    twitterShare() {

    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-input__append-outer {
  display: flex;
  flex-direction: column;
  min-height: 38px;
  margin: 0 !important;
}

.elite {
  border: 1px solid $gold !important;
  border-radius: 5px;
  background: rgba($gold, 0.1);
}

@media only screen and (max-width: 400px) {
  .tier-list-item {
    flex-wrap: wrap;

    .tier-title {
      width: 100%;
      margin-bottom: 4px;
    }
  }
}

</style>
