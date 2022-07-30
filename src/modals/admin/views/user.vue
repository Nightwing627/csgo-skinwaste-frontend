<template>
  <v-row class="mb-6 px-2">
    <v-col cols="12" md="4">
      <v-text-field
        v-model="input.userid"
        label="UserID or SteamID"
        hide-details class="mb-3"
        filled dense background-color="grey500"
      />

      <v-btn block color="secondary" :loading="loading.user" @click="getUser">
        Get User
      </v-btn>

      <span class="grey700--text">5e066b957c8d3377fe63f8e3</span>
    </v-col>


    <v-col cols="12" md="8">
      <v-progress-circular v-show="loading.user" indeterminate />

      <div v-if="userinfo">
        <v-card flat color="grey700" class="px-5 py-3 mb-6">
          <v-row align="center">
            <v-col cols="3">
              <v-img :src="userinfo.avatar" aspect-ratio="1" width="100%" />
            </v-col>
            <v-col cols="9" class="px-2">
              <div class="d-flex flex-center-y mb-2">
                <!-- username -->
                <div
                  v-if="userinfo.rank === 2"
                  class="pa-1 bdrd-1 secondary700 mr-1 overline fw-semibold lh-1 flex-no-shrink"
                >
                  MOD
                </div>
                <div
                  v-if="userinfo.rank === 3"
                  class="pa-1 bdrd-1 primary mr-1 overline fw-semibold lh-1 flex-no-shrink"
                >
                  ADMIN
                </div>
                <UserLevel class="py-1 px-2 mr-2" :level="userinfo.level" />
                <span class="text-truncate">{{ userinfo.username }}</span>
                <fai v-if="userinfo.rank === 1" :icon="['fas', 'badge-check']" class="ml-1 subtitle-1 info--text" />
              </div>

              <!-- balance  -->
              <div class="disp-flex flex-center-y body-2 mb-1">
                <fai class="gold--text mr-2" :icon="['fas','coins']" />
                <span class="fw-bold">{{ userinfo.balance | currencyInt }}</span>
              </div>

              <!-- banlevel  -->
              <div v-show="userinfo.banLevel > 0" class="disp-flex flex-center-y body-3 mb-1 primary--text fw-bold">
                <fai class="mr-2" icon="ban" />
                BANNED (
                <span v-if="userinfo.banLevel === 1">CHAT</span>
                <span v-if="userinfo.banLevel === 2">WITHDRAW</span>
                <span v-if="userinfo.banLevel === 3">FULL</span>
                )
              </div>

              <div class="caption">
                <b>STEAMID: </b>
                <span>{{ userinfo.steamID }}</span>
                <a class="link ml-2" :href="`https://steamcommunity.com/profiles/${userinfo.steamID}`" target="_blank" rel="noopener noreferrer">
                  <fai icon="external-link" />
                </a>
              </div>

              <div class="caption">
                <b>USERID: </b>
                <span>{{ userinfo._id }}</span>
              </div>

              <div v-if="userinfo.affiliateUsedId" class="caption">
                <b>REF CODE: </b>
                <span>{{ userinfo.affiliateUsedId.code }}</span>
              </div>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12">
              <h4 class="body-2 fw-bold primary--text text-uppercase mb-1">
                Stats
              </h4>
              <v-row class="mb-6">
                <v-col cols="4" class="text-center">
                  <div class="subtitle-1 fw-bold">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.deposited | currencyInt }}
                  </div>
                  <div class="caption faded-8 text-uppercase fw-semibold">
                    Total Deposited
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="subtitle-1 fw-bold">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.wagered | currencyInt }}
                  </div>
                  <div class="caption faded-8 text-uppercase fw-semibold">
                    Total Wagered
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="subtitle-1 fw-bold">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.won | currencyInt }}
                  </div>
                  <div class="caption faded-8  text-uppercase fw-semibold">
                    Total Won
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="subtitle-1 fw-bold">
                    <fai class="gold--text  mr-2" :icon="['fas', 'coins']" />
                    <span>{{ userinfo.withdrawn | currencyInt }}</span>
                  </div>
                  <div class="caption faded-8  text-uppercase fw-semibold">
                    Withdrawn
                  </div>
                </v-col>
                <v-col cols="4" class="text-center">
                  <div class="subtitle-1 fw-bold">
                    <fai class="gold--text  mr-2" :icon="['fas', 'coins']" />
                    <span>{{ userinfo.deposited - userinfo.withdrawn | currencyInt }}</span>
                  </div>
                  <div class="caption faded-8  text-uppercase fw-semibold">
                    Profit (Deposit vs Withdrawn)
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="text-center">
                  <span class="fw-bold subtitle-1">
                    <fai class="gold--text mr-1" :icon="['fas','coins']" />
                    {{ userinfo.amountBeforeWithdrawal | currencyInt }}
                  </span>
                  <div class="fw-bold caption info--text text-uppercase">
                    To Wager
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col cols="12">
              <h4 class="body-2 fw-bold primary--text text-uppercase mb-1">
                Crypto
              </h4>
              <div v-for="(currency, address) in userinfo.cryptoAddresses" :key="currency" class="body-2">
                <b>{{ address }}: </b>
                <span>{{ currency }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-expansion-panels class="mb-5">
          <v-expansion-panel>
            <v-expansion-panel-header class="grey700 primary--text fw-semibold">
              Affiliate Data
            </v-expansion-panel-header>
            <v-expansion-panel-content color="grey700">
              <v-row v-if="userinfo.affiliates">
                <v-col cols="12">
                  <h4 class="subtitle-1 fw-bold primary--text">
                    Tier {{ userinfo.affiliates.level }} affiliate
                    <span v-show="userinfo.affiliates.levelOverride">(Overwritten)</span>
                  </h4>

                  <div class="caption">
                    <b>CODE: </b>
                    <span>{{ userinfo.affiliates.code }}</span>
                  </div>
                  <div class="caption">
                    <b>Elite: </b>
                    <span v-if="userinfo.affiliates.elite">
                      <fai icon="crown" class="mr-1 gold--text " />
                      yes
                    </span>
                    <span v-else>Nope</span>
                  </div>
                  <div class="caption">
                    <b>Cut: </b>
                    <span>{{ config.affiliate.tiers[userinfo.affiliates.level].bonus * 100 }}%</span>
                  </div>
                  <div class="caption">
                    <b>ID: </b>
                    <span>{{ userinfo.affiliates._id }}</span>
                  </div>
                </v-col>

                <v-col cols="6" sm="4" class="text-center">
                  <div class="headline">
                    <fai class="primary--text mr-1" :icon="['fas', 'users']" />
                    {{ userinfo.affiliates.totalUsersReferred }}
                  </div>
                  <div class="caption text-uppercase fw-bold">
                    Users referred
                  </div>
                </v-col>
                <v-col cols="6" sm="4" class="text-center">
                  <div class="headline">
                    <fai class="primary--text mr-1" :icon="['fas', 'funnel-dollar']" />
                    {{ userinfo.affiliates.referralDeposits }}
                  </div>
                  <div class="caption text-uppercase fw-bold">
                    which deposited
                  </div>
                </v-col>
                <v-col cols="12" sm="4" class="text-center">
                  <div class="headline">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.affiliates.referralsWagered | currencyInt }}
                  </div>
                  <div class="caption text-uppercase fw-bold">
                    Total Wagered
                  </div>
                </v-col>


                <v-col cols="6" class="text-center">
                  <div class="headline">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.affiliates.balance | currencyInt }}
                  </div>
                  <div class="caption text-uppercase fw-bold">
                    Balance
                  </div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="headline">
                    <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                    {{ userinfo.affiliates.earnings | currencyInt }}
                  </div>
                  <div class="caption text-uppercase fw-bold">
                    Total Earned
                  </div>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12">
                  <h4 class="subtitle-2 fw-bold faded-8">
                    No affiliate data
                  </h4>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <h4 class="subtitle-1 fw-bold primary--text text-uppercase mb-2">
          Actions
        </h4>

        <!-- give bal -->
        <v-card v-if="hasPermission(permissions.CAN_ADD_BALANCE, user.permissions)" flat color="grey700" class="mb-5">
          <v-card-title class="d-block grey500">
            <h5 class="fw-bold subtitle-2 mb-1">
              Give Balance
            </h5>
            <p class="caption mb-0 break-word faded-8 grey100--text lh-1-5">
              Adds the given amount to the users balance. Type is shown in their payment history page.
              Increment "To Wager" forces people to play with the given money, so they can't just cash it out.
            </p>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6" class="py-0">
                <label class="caption text-uppercase fw-semibold primary--text">Amount</label>
                <v-text-field
                  v-model.number="input.balance.value" :rules="validations.balance"
                  background-color="grey500" filled
                >
                  <template v-slot:prepend-inner>
                    <fai class="mr-1 gold--text title" :icon="['fas','coins']" />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6" class="py-0">
                <label class="caption text-uppercase fw-semibold primary--text d-block">Type</label>
                <v-btn-toggle
                  v-model="input.balance.type" borderless
                  mandatory background-color="grey500" color="info"
                >
                  <v-btn color="grey500" class="caption fw-semibold" :value="5">
                    Sponsor
                  </v-btn>
                  <v-btn color="grey500" class="caption fw-semibold" :value="7">
                    Support
                  </v-btn>
                  <v-btn color="grey500" class="caption fw-semibold" :value="12">
                    Trivia
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" class="py-0">
                <label class="caption text-uppercase fw-semibold primary--text d-block">toWager Multiplier</label>
                <v-text-field
                  v-model.number="input.balance.multiplier" :rules="validations.balance"
                  background-color="grey500" filled
                >
                  <template v-slot:prepend-inner>
                    <fai class="mr-1 primary--text title" :icon="['fas','times']" />
                  </template>
                </v-text-field>
                <!-- <v-checkbox
                  v-model="input.balance.locked" color="primary" persistent-hint
                  label="Increment to wager?" hint="You better have a good fucking reason to turn this off."
                /> -->
              </v-col>

              <v-col cols="12" class="d-flex flex-end-x">
                <v-btn color="secondary" :block="$vuetify.breakpoint.xs" :loading="loading.balance" @click="giveBalance">
                  Send Coins
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-if="hasPermission(permissions.SUPER_ADMIN, user.permissions)" flat color="grey700" class="mb-5">
          <v-card-title class="d-block grey500">
            <h5 class="fw-bold subtitle-2 mb-1">
              Assign Permsissions
            </h5>
            <p class="caption mb-0 break-word faded-8 grey100--text lh-1-5">
              Checking boxes and submitting will apply permssions to users that have Rank of Mod and up.
            </p>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row>
              <v-checkbox
                v-for="(permission, i) in permissions" :key="i" v-model="permissionsSelected" class="mx-2"
                :label="i" :value="permission"
              />
              <v-col cols="12" class="d-flex flex-end-x">
                <v-btn color="secondary" :block="$vuetify.breakpoint.xs" :loading="loading.balance" @click="giveBalance">
                  Save Permsissions
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ban -->
        <v-card flat color="grey700" class="mb-5">
          <v-card-title class="d-block grey500">
            <h5 class="fw-bold subtitle-2 mb-1">
              Ban User
            </h5>
            <p class="caption mb-0 break-word faded-8 grey100--text lh-1-5">
              Chat ban is perma. Withdraw ban stops them from cashing out.
              Full ban blocks any requests they make to anything.
            </p>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="8" class="py-0">
                <label class="caption text-uppercase fw-semibold primary--text d-block">Ban Type</label>
                <v-btn-toggle
                  v-model="input.ban.type" borderless
                  mandatory background-color="grey500" color="primary"
                >
                  <v-btn color="grey500" class="caption fw-semibold" :value="0">
                    None
                  </v-btn>
                  <v-btn color="grey500" class="caption fw-semibold" :value="1">
                    Chat
                  </v-btn>
                  <v-btn color="grey500" class="caption fw-semibold" :value="2">
                    Withdraw
                  </v-btn>
                  <v-btn color="grey500" class="caption fw-semibold" :value="3">
                    Full
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" md="4" class="d-flex flex-end-x">
                <v-btn color="primary" :block="$vuetify.breakpoint.xs" :loading="loading.ban" @click="banUser">
                  Apply
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>

      <v-card v-else-if="!loading.user" color="grey700" class="py-8 text-center">
        <span class="faded-8">
          Enter an ID to get started.
        </span>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { admin as api } from '@/api'
import { errorToast } from '@/utils'
import { PERMISSIONS } from '@/utils/constants'

import UserLevel from '@/components/UserLevel.vue'

export default {
  name: 'ModalAdminViewUser',
  components: {
    UserLevel
  },
  data() {
    return {
      userinfo: null,
      input: {
        userid: '',
        balance: {
          value: 0,
          type: 5,
          multiplier: 1
        },
        ban: {
          type: 'none'
        }
      },
      loading: {
        user: false,
        balance: false,
        ban: false
      },
      permissions: PERMISSIONS,
      permissionsSelected: [],
      validations: {
        balance: [
          v => v != null || 'This field is required.',
          v => !Number.isNaN(v) || 'Invalid number',
          v => v >= 0 || 'Invalid number'
        ]
      }
    }
  },
  watch: {
    permissionsSelected(val) {
      console.log(val)
    }
  },
  created() {
    this.$on('inspect', id => {
      this.input.userid = id
      this.getUser()
    })
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    })
  },
  methods: {
    hasPermission(perm, userPerms) {
      if (userPerms && (userPerms & perm || userPerms & PERMISSIONS.SUPER_ADMIN)) return true
      return false
    },
    async getUser() {
      if (this.loading.user) return
      if (!this.input.userid || this.input.userid === '') return

      this.loading.user = true
      this.userinfo = null

      try {
        this.userinfo = await api.getUser(this.input.userid)

        if (this.userinfo._id) {
          this.permissionsSelected = Object.values(PERMISSIONS).filter(perm => this.userinfo.permissions & perm)
          const { data: affiliates } = await api.searchAffiliates({
            page: 1,
            limit: 1,
            user_id: this.userinfo._id
          })

          if (affiliates.length) {
            this.userinfo.affiliates = affiliates[0]
          }
        }

        this.input.ban.type = this.userinfo.banLevel
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.user = false
      }
    },
    async giveBalance() {
      if (this.loading.balance) return
      if (Number.isNaN(this.input.balance.value)) return
      if (this.input.balance.value <= 0) return
      if (!this.userinfo || !this.userinfo._id) return
      if (!this.input.balance.type) return

      this.loading.balance = true

      const amount = this.input.balance.value * 100
      const { type, multiplier } = this.input.balance

      try {
        const resp = await api.giveBalance(amount, type, this.userinfo._id, multiplier)
        this.$toast.open({ type: 'success', text: 'Balance sent.' })
        this.userinfo.balance += resp.amount
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.balance = false
      }
    },
    async banUser() {
      if (this.loading.ban) return
      if (this.input.ban.type === undefined) return

      this.loading.ban = true

      const { type } = this.input.ban

      try {
        const resp = await api.ban(this.userinfo._id, type)
        this.$toast.open({ type: 'success', text: 'Ban type updated.' })
        this.userinfo.banLevel = type
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.ban = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .v-input__append-outer {
    margin: 0 !important;
  }

  .v-btn.send-btn {
    height: unset;
    max-height: unset;
  }
</style>
