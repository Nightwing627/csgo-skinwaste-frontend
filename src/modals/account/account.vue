<template>
  <v-card class="modal bdrd-2">
    <v-card-title
      class="grey700 px-4 flex-between-x flex-start-y grey100--text"
    >
      <div class="disp-flex flex-center-y">
        <v-img
          :src="user.avatar"
          aspect-ratio="1"
          class="bdrd-2 mr-3 flex-no-shrink flex-no-grow"
          width="64"
        />
        <div>
          <div class="disp-flex flex-center-y" style="font-size: 0.85em">
            <UserLevel
              class="mr-2"
              :opaque="false"
              :level="user.level"
              :user="user"
            />
            {{ user.username | truncate(16) }}
            <fai
              v-if="user.rank === 1"
              :icon="['fas', 'badge-check']"
              class="ml-1 info--text"
            />
          </div>
          <div class="disp-flex flex-center-y body-2">
            <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
            <span class="fw-bold">{{ user.balance | currencyInt }}</span>
          </div>
        </div>
      </div>
      <v-btn
        color="grey100"
        text
        small
        class="fw-bold"
        :disabled="loading"
        @click="refreshStats"
      >
        <fai class="mr-2" :spin="loading" :icon="['fas', 'sync']" />
        Refresh
      </v-btn>
    </v-card-title>

    <v-tabs
      v-model="tab"
      centered
      center-active
      show-arrows
      background-color="grey700"
    >
      <v-tab :ripple="false">
        Info
      </v-tab>
      <v-tab :ripple="false">
        Bet History
      </v-tab>
      <v-tab :ripple="false">
        Payment History
      </v-tab>
    </v-tabs>

    <v-card-text
      class="pa-0 text--text grey900 full-height"
      style="max-height: 500px;"
    >
      <v-tabs-items v-model="tab" class="grey900">
        <!-- stats -->
        <v-tab-item class="grey900 pa-3">
          <v-row class="mb-6">
            <v-col cols="12">
              <h3
                class="subtitle-1 fw-bold text-uppercase text-center primary--text "
              >
                Lifetime stats
              </h3>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                {{ user.deposited | currencyInt }}
              </div>
              <div class="caption faded-8 text-uppercase fw-semibold">
                Total Deposited
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                {{ user.wagered | currencyInt }}
              </div>
              <div class="caption faded-8 text-uppercase fw-semibold">
                Total Wagered
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text mr-1" :icon="['fas', 'coins']" />
                {{ user.won | currencyInt }}
              </div>
              <div class="caption faded-8  text-uppercase fw-semibold">
                Total Won
              </div>
            </v-col>
            <!-- <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text  mr-2" :icon="['fas', 'coins']" />
                {{ user.withdrawn | currencyInt }}
              </div>
              <div class="caption faded-8  text-uppercase fw-semibold">
                Total Withdrawn
              </div>
            </v-col> -->
            <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text  mr-2" :icon="['fas', 'coins']" />
                <span
                  :class="
                    profitDeposited >= 0 ? 'secondary--text' : 'error--text'
                  "
                >{{ profitDeposited | currencyInt }}</span>
              </div>
              <div class="caption faded-8  text-uppercase fw-semibold">
                Profit (Deposited)
              </div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="subtitle-1 fw-bold">
                <fai class="gold--text  mr-2" :icon="['fas', 'coins']" />
                <span
                  :class="
                    profitWagered >= 0 ? 'secondary--text' : 'error--text'
                  "
                >{{ profitWagered | currencyInt }}</span>
              </div>
              <div class="caption faded-8  text-uppercase fw-semibold">
                Profit (Wagered)
              </div>
            </v-col>
          </v-row>
          <v-row class="px-3">
            <v-col cols="12" class="text-center">
              <h3 class="caption fw-bold text-uppercase">
                Support ID
              </h3>
              <p class="mb-0 faded-8">
                {{ user._id }}
              </p>
            </v-col>
          </v-row>
          <v-row class="px-3">
            <v-col cols="12" class="user-level">
              <h3 class="d-flex caption fw-bold text-uppercase mx-2">
                Level {{ user.level }}
              </h3>
              <div
                class="progress"
                :style="{ '--width': `${getNeededWager() * 100}%` }"
              >
                <div class="progress-value" />
              </div>
            </v-col>
          </v-row>
        </v-tab-item>

        <!-- jackpot history -->
        <v-tab-item class="grey900 pa-3">
          <div v-if="betHistory && !loading">
            <v-select
              :items="betTypes"
              :value="betValue"
              label="Select a game..."
              @change="betSelect"
            />
            <h3 class="subtitle-2 fw-bold text-uppercase primary--text mb-2">
              Last {{ betHistory.length }} bets
            </h3>

            <BetHistory
              :history="betHistory"
              :bet-value="betValue"
              :user="user"
              :games="betHistoryGames"
            />

            <div
              v-show="betHistory.length === 50"
              class="caption text-center mt-3"
            >
              Please contact support if you would like to retrieve more bets.
            </div>
          </div>

          <div v-else class="loaders pa-5">
            <v-skeleton-loader class="mb-2" type="paragraph" />
            <v-skeleton-loader class="mb-2" type="paragraph" />
            <v-skeleton-loader type="paragraph" />
          </div>
        </v-tab-item>

        <!-- payment history -->
        <v-tab-item class="grey900 pa-3">
          <div v-if="paymentHistory && !loading">
            <v-select
              :items="transactionTypes"
              :value="transactionValue"
              label="Select a transaction type..."
              multiple
              @change="transactionSelect"
            />
            <h3 class="subtitle-2 fw-bold text-uppercase primary--text mb-2">
              Last {{ paymentHistory.length }} payments
            </h3>

            <div
              v-for="payment in paymentHistory"
              :key="payment.paymentID"
              class="grey500 mb-2 bdrd-2 pa-4"
            >
              <v-row no-gutters align="center">
                <v-col cols="6">
                  <h5 class="subtitle-2 lh-1 mb-1">
                    <fai
                      v-if="payment.status === 0"
                      icon="sync"
                      spin
                      class="mr-2"
                    />
                    <fai
                      v-if="payment.status === 4"
                      icon="ban"
                      title="Approval Denied"
                      class="mr-1 primary--text"
                    />

                    <span
                      v-if="payment.type === 0"
                      class="primary--text text-uppercase fw-bold"
                    >Withdrawal ({{ payment.currency }})</span>
                    <span
                      v-if="payment.type === 1"
                      class="secondary--text text-uppercase fw-bold"
                    >Deposit ({{ payment.currency }})</span>
                    <span
                      v-if="payment.type === 5"
                      class="secondary--text text-uppercase fw-bold"
                    >Admin (Sponsorship)</span>
                    <span
                      v-if="payment.type === 7"
                      class="secondary--text text-uppercase fw-bold"
                    >Admin (Support)</span>
                    <span
                      v-if="payment.type === 10"
                      class="gold--text text-uppercase fw-bold"
                    >Affiliate Cut</span>
                    <span
                      v-if="payment.type === 11"
                      class="secondary--text text-uppercase fw-bold"
                    >Affiliates Cashout</span>
                    <span
                      v-if="payment.type === 12"
                      class="secondary--text text-uppercase fw-bold"
                    >Admin (Gift/Trivia)</span>
                    <span
                      v-if="payment.type === 14"
                      class="gold--text text-uppercase fw-bold"
                    >
                      <fai icon="crown" class="mr-1" />
                      Elite Affiliate Cut
                    </span>
                    <span
                      v-if="payment.type === 17"
                      class="primary--text text-uppercase fw-bold"
                    >CS:GO Cashout</span>
                    <span
                      v-if="payment.type === 18"
                      class="secondary--text text-uppercase fw-bold"
                    >CS:GO Refund</span>
                  </h5>
                  <div class="caption lh-1 mb-1">
                    {{ new Date(payment.createdAt).toLocaleString() }}
                  </div>
                  <div class="caption light--text lh-1">
                    {{ payment._id }}
                  </div>
                  <div
                    v-if="
                      payment.extra &&
                        payment.extra.game &&
                        transactionValue.includes(4)
                    "
                    class="caption lh-1 mt-2 fw-bold"
                  >
                    Game:
                    {{
                      payment.extra.game === "catcher"
                        ? "EZ"
                        : payment.extra.game
                    }}
                  </div>
                  <div
                    v-if="payment.foreign_trx_id && payment.currency === 'ETH'"
                    class="caption lh-1 mt-2 fw-bold"
                  >
                    <a
                      :href="
                        `https://etherscan.io/tx/${payment.foreign_trx_id}`
                      "
                      target="_blank"
                      class="link blue--text"
                    >
                      <fai icon="external-link" />
                      Etherscan
                    </a>
                  </div>
                </v-col>
                <v-col
                  cols="6"
                  class="disp-flex fw-semibold subtitle-1 flex-center-y flex-end-x"
                  :class="
                    payment.type === 0 ||payment.type === 8 || payment.type === 17
                      ? 'danger--text'
                      : 'secondary--text'
                  "
                >
                  <fai
                    v-show="payment.type !== 10 && payment.type !== 14"
                    class="mr-2 body-2"
                    :icon="[
                      'fas',
                      payment.type === 0 ||payment.type === 8 || payment.type === 17
                        ? 'minus'
                        : 'plus'
                    ]"
                  />
                  <fai class="gold--text mr-2" :icon="['fas', 'coins']" />
                  <span
                    :class="
                      (payment.type === 10 || payment.type === 14) &&
                        'grey100--text'
                    "
                  >{{ payment.amount | currencyInt }}</span>
                </v-col>
              </v-row>
            </div>
            <div
              v-show="paymentHistory.length === 30"
              class="caption text-center mt-3"
            >
              Please contact support if you would like to retrieve more payment
              history.
            </div>
          </div>

          <div v-else class="loaders pa-5">
            <v-skeleton-loader class="mb-2" type="paragraph" />
            <v-skeleton-loader class="mb-2" type="paragraph" />
            <v-skeleton-loader type="paragraph" />
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions class="pa-4 grey900 flex-end-x">
      <div class="btns">
        <v-btn
          small text :ripple="false" class="px-2 fw-bold"
          @click="close"
        >
          Close
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./account.js"></script>
<style lang="scss" src="./account.scss"></style>
