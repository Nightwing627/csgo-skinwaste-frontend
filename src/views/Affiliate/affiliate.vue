<template>
  <v-container v-if="user" id="rewards">
    <v-row no-gutters>
      <v-col class="pa-5" cols="12">
        <!-- <v-card color="grey700" class="mx-auto pa-8 body-2" style="max-width: 1000px;"> -->
        <h1 class="headline mb-6">
          <fai :icon="['fas', 'chart-network']" class="primary--text mr-3" />
          Affiliates
        </h1>

        <v-row>
          <v-col v-for="(item, i) in earnings" :key="i">
            <v-card color="grey700" class="pa-5">
              <div class="d-flex justify-space-between">
                <div class="d-flex justify-space-between align-center">
                  <fai
                    v-if="item.icon"
                    :icon="item.icon"
                    class="primary--text mr-3"
                  />
                  <div class="font-weight-bold">
                    {{ item.text }}
                  </div>
                </div>
                <div class="font-weight-light">
                  {{ item.amount }}
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col>
            <v-btn
              class="text-capitalize pa-5"
              color="success"
              block
              style="height: 100%"
              :disabled="!affiliates || !affiliates.balance"
              @click="onClickClaimEarnings"
            >
              <fai :icon="['fas', 'dollar-sign']" class="mr-3" />
              Claim Earnings
            </v-btn>
          </v-col>
        </v-row>

        <v-card color="grey700" class="commision-card pa-5 mb-5">
          <v-row>
            <v-col cols="12" md="6" class="align-self-center">
              <div class="title mb-5">
                You get a <span class="primary--text">commission</span> every
                time when someone uses your code for their deposit.
              </div>
              <div class="caption">
                You receive
                <span
                  class="gold--text fw-bold"
                >{{
                  Math.round(config.affiliate.referralDepositBonus * 100)
                }}%</span>
                for every deposit they make, while they receive
                <span
                  class="gold--text fw-bold"
                >{{
                  Math.round(config.affiliate.referralDepositBonus * 100)
                }}%</span>
                when they use your code. That’s win-win for both of you.
              </div>
            </v-col>

            <v-divider vertical />

            <v-col cols="12" md="6" class="align-self-center">
              <v-form
                ref="referralForm"
                v-model="isReferralFormValid"
                lazy-validation
                @submit.prevent="onClickSetReferralCode"
              >
                <v-row>
                  <v-col cols="12">
                    <div>Your Referral Code</div>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="referralCode"
                      label="Enter code..."
                      outlined
                      single-line
                      :rules="[referralRules.required]"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn
                      type="submit"
                      color="primary"
                      block
                      class="text-capitalize py-7"
                    >
                      <fai :icon="['fas', 'plus']" class="mr-3" />
                      Set Code
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-text-field
                outlined
                label="Your referral code"
                :value="currentReferralCode"
                readonly
                disabled
              >
                <template slot="append">
                  <v-btn
                    class="btn-copy-to-clipboard"
                    icon
                    @click="copyToClipboard"
                  >
                    <fai :icon="['fas', 'copy']" />
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <v-card color="grey700">
          <v-card-title>
            <fai :icon="['fad', 'gifts']" class="primary--text mr-3" />
            Rewards
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row class="px-2">
              <v-col cols="12" md="4">
                <DailyReward :user="user" class="reward-box mr-1" />
              </v-col>
              <v-col cols="12" md="4">
                <TwitterReward :user="user" class="reward-box mr-1" />
              </v-col>
              <v-col cols="12" md="4">
                <DiscordReward :user="user" class="reward-box" />
              </v-col>

              <v-col cols="12" md="6">
                <v-form
                  ref="redeemForm"
                  v-model="isRedeemFormValid"
                  lazy-validation
                  @submit.prevent="onClickRedeemPromo"
                >
                  <v-row>
                    <v-col cols="12">
                      Redeem Voucher Promo
                    </v-col>
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="promoCode"
                        label="Enter code..."
                        outlined
                        single-line
                        :rules="[redeemRules.required]"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-btn
                        type="submit"
                        color="primary"
                        block
                        class="text-capitalize py-7"
                      >
                        Redeem Promo
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pa-5" cols="12">
        <!-- <v-card color="grey700" class="pa-5 mb-5"> -->
        <ReferredUsers :items="referredUsers" />
        <!-- </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

import DailyReward from '@/components/Reward/DailyReward.vue'
import TwitterReward from '@/components/Reward/TwitterReward.vue'
import DiscordReward from '@/components/Reward/DiscordReward.vue'
import ReferredUsers from '@/components/Reward/ReferredUsers.vue'

import ToastMessage from '@/components/toast'

import { affiliate as api, user } from '@/api'

export default {
  name: 'AffilaitePage',
  components: {
    DailyReward,
    TwitterReward,
    DiscordReward,
    ReferredUsers
  },
  data() {
    return {
      promoCode: '',
      referralCode: '',
      isReferralFormValid: true,
      isRedeemFormValid: true,
      earnings: []
    }
  },
  computed: {
    ...mapGetters({ config: 'config', user: 'user/getUser', affiliates: 'user/affiliates' }),
    currentReferralCode() {
      if (this.affiliates && this.affiliates.code) {
        return this.affiliates.code
      }

      return ''
    },
    referredUsers() {
      // @TODO: FIll the value with user data
      return [
        // {
        //   createdAt: new Date(), id: 1, user_id: 1, balance: 100, earnings: 5
        // },
        // {
        //   createdAt: new Date(), id: 2, user_id: 1, balance: 100, earnings: 5
        // }
      ]
    },
    redeemRules() {
      return {
        required: val => !!val || 'Please enter a code to redeem'
      }
    },
    referralRules() {
      return {
        required: val => !!val || 'Please enter a referral code'
      }
    }
  },
  async mounted() {
    // FUTURE: implement router guard
    if (this.$store.state.user.user) {
      await this.getAffiliateStats()
    } else {
      this.$router.push({ name: 'home' })
    }
    this.getEarnings()
  },
  methods: {
    ...mapActions({
      getAffiliateStats: 'user/getAffiliateStats',
      setAffiliateCode: 'user/setAffiliateCode',
      usePromoCode: 'promo/useCode'
    }),
    ...mapMutations({ setUser: 'user/setUser' }),
    getEarnings() {
      let usersReferred = 0
      let userEarnings = 0
      let userBalance = 0

      if (this.affiliates) {
        const { totalUsersReferred, earnings, balance } = this.affiliates

        usersReferred = totalUsersReferred
        userEarnings = earnings / 100
        userBalance = balance / 100
      }

      this.earnings = [
        {
          icon: ['fas', 'dollar-sign'],
          text: 'Users Referred',
          amount: usersReferred
        },
        {
          icon: ['fas', 'dollar-sign'],
          text: 'Total Earnings',
          amount: userEarnings.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })
        },
        {
          icon: '',
          text: 'Available Earnings',
          amount: userBalance.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          })
        }
      ]
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.currentReferralCode)

      ToastMessage.open({
        type: 'success',
        text: 'Referral code copied to clipboard',
        closable: false
      })
    },
    async onClickClaimEarnings() {
      try {
        await api.collect()
        ToastMessage.open({
          type: 'success',
          text: 'Earnings claimed successfully',
          closable: true
        })
        this.setUser(await user.get())
        await this.getAffiliateStats()
        this.getEarnings()
      } catch (e) {
        console.log(e)
        ToastMessage.open({
          type: 'error',
          text: 'Error claiming earnings',
          closable: true
        })
      }
    },
    async onClickRedeemPromo() {
      if (this.$refs.redeemForm.validate()) {
        try {
          await this.usePromoCode({ code: this.promoCode })
          await this.setUser(await api.get())
          ToastMessage.open({
            type: 'success',
            text: 'Promo code redeemed successfully',
            closable: false
          })
        } catch (error) {
          // unusedError because ToastError used
        } finally {
          this.$refs.redeemForm.reset()
        }
      }
    },
    async onClickSetReferralCode() {
      if (this.$refs.referralForm.validate()) {
        try {
          await this.setAffiliateCode(this.referralCode)

          ToastMessage.open({
            type: 'success',
            text: 'Affiliate code defined successfully',
            closable: false
          })
        } finally {
          this.$refs.referralForm.reset()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#rewards {
  // .v-icon {
  //   &.fa-copy {
  //     font-size: 16px !important;
  //   }
  // }
  .btn-copy-to-clipboard {
    transform: translateY(-0.5rem);
  }

  .reward-box {
    background-color: #4b586e;
    border-radius: 3px;
    min-height: 70px;
    display: flex;
    align-content: center;
    align-items: center;
  }

  @media (min-width: 960px) {
    .commision-card {
      .col-md-6 {
        max-width: calc(50% - 1px);
      }
    }
  }
}
</style>
