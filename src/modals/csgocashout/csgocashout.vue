<template>
  <v-card class="modal bdrd-2">
    <v-stepper v-model="step" class="full-height">
      <v-stepper-items class="full-height">
        <v-stepper-content class="pa-0 full-height grey900" step="1">
          <v-card flat color="grey900" class="d-flex flex-column full-height">
            <v-card-title class="d-block d-sm-flex text--text grey700 flex-between-x px-3 flex-center-y">
              <div class="mb-3 mb-sm-0">
                <h2 class="title lh-1 mb-2">
                  CS:GO Store
                </h2>
                <div class="disp-flex body-2 flex-center-y">
                  <span class="mr-2">Your balance</span>
                  <fai class="gold--text mr-1" :icon="['fas','coins']" />
                  <span class="fw-bold">{{ user.balance | currencyInt }}</span>
                  <fai class="link secondary--text ml-1" :icon="['fas','plus-circle']" @click="$modal.open('topup', {maxWidth: 500})" />
                </div>
                <!-- <p class="caption faded-8 lh-1 mb-0 fw-semibold">
                  Withdraw real skins to play with!
                </p> -->
              </div>

              <div class="disp-flex fw-regular flex-center">
                <v-tooltip color="secondary" bottom>
                  <template v-slot:activator="{on}">
                    <v-btn
                      :color="onlyShowAffordable ? 'secondary700 grey100--text' : 'grey500 light--text'"
                      class="ma-0 mr-2 no-minwidth" v-on="on"
                      @click="onlyShowAffordable = !onlyShowAffordable"
                    >
                      <fai class="subtitle-1" :icon="['fas','funnel-dollar']" />
                    </v-btn>
                  </template>
                  <span>Only show affordable items</span>
                </v-tooltip>
                <v-text-field
                  v-model="search"
                  class="mr-2"
                  background-color="grey500"
                  hide-details placeholder="Search" solo dense
                  flat
                />
                <v-btn
                  color="grey500" class="ma-0 no-minwidth"
                  @click="refreshInventory"
                >
                  <fai class="grey100--text" :spin="loading.balance" :icon="['fas','sync']" />
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text class="px-3 pt-3 pb-0 text-center pos-relative flex-grow">
              <Inventory :items="filteredItems" :loading="loading.inventory" @onItemClick="selectItem" />
              <div v-show="!loading.inventory && !items.length" class="mb-8">
                <v-btn
                  depressed
                  color="gold grey900--text"
                  class="mx-4"
                  @click="$modal.open('buy', {maxWidth: 900}); close()"
                >
                  <div class="disp-flex flex-center-y">
                    <fai :icon="['fas', 'coins']" class="mr-3" />
                    <span>Get items</span>
                  </div>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-stepper-content>

        <v-stepper-content class="pa-0 testies full-height grey900" step="2">
          <v-card flat color="grey900">
            <v-card-text class="pt-0 grey900 text--text">
              <v-row>
                <v-col cols="12">
                  <p class="title mb-1">
                    Peer-to-Peer Trading
                  </p>
                  <p class="mb-3">
                    We don't use bots. This means trades can take up to 5 minutes.
                    If a trade fails, you'll be refunded.
                  </p>
                  <v-card color="grey500" class="pa-3 pb-2 mb-6" flat>
                    <h4 class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1">
                      Steam Trade URL
                    </h4>
                    <v-text-field
                      v-model="tradeurl" :readonly="!editing"
                      hide-details solo dense filled
                      class="mb-1"
                      placeholder="Please fill in your trade url"
                      flat background-color="grey900" color="red"
                    >
                      <template v-slot:append class="pa-0">
                        <v-btn
                          color="secondary"
                          :ripple="false"
                          small
                          class="flex-grow fw-bold"
                          :loading="loading.tradeurl"
                          @click="editing ? setTradeURL() : editing = true"
                        >
                          {{ editing ? 'Set' : 'Change' }}
                        </v-btn>
                      </template>
                    </v-text-field>
                    <a
                      href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
                      target="_blank" class="caption fw-semibold link lh-1"
                    >Click here to find it</a>
                  </v-card>

                  <div class="caption fw-semibold primary--text text-center faded-8 px-4">
                    Please make sure your Steam account can trade and verify the trade URL before withdrawing.
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>


    <v-card-actions class="pa-4 grey700 flex-center-y flex-between-x">
      <div class="grey100--text lh-1-2">
        <div class="disp-flex flex-center-y">
          <fai class="gold--text mr-2" :icon="['fas','coins']" />
          <span>{{ selectedValue | currencyInt }}</span>
        </div>
        <div class="body-2 grey100--text">
          {{ selected.length }} items selected
        </div>
      </div>

      <div>
        <v-btn
          v-if="step === 1"
          small text :ripple="false"
          class="px-2 mr-2 fw-bold"
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          v-else
          small text :ripple="false"
          class="px-2 mr-2 fw-bold"
          @click="step = 1"
        >
          Back
        </v-btn>


        <v-btn
          v-if="step === 1"
          color="success"
          large depressed :ripple="false"
          class="px-8 fw-bold"
          :disabled="!canNext"
          @click="step = 2"
        >
          Next
        </v-btn>
        <v-btn
          v-else
          color="success"
          large depressed :ripple="false"
          class="px-4 fw-bold"
          :disabled="!canWithdraw"
          :loading="loading.withdraw"
          @click="cashout"
        >
          Withdraw
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./csgocashout.js"></script>
<style lang="scss" scoped src="./csgocashout.scss"></style>
