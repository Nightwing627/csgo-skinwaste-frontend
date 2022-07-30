<template>
  <v-card class="modal bdrd-2">
    <v-stepper v-model="step" class="full-height">
      <v-stepper-items class="full-height">
        <v-stepper-content class="pa-0 full-height grey900" step="1">
          <v-card flat color="grey900" class="d-flex flex-column full-height">
            <v-card-title class="d-block d-sm-flex text--text grey700 flex-between-x px-3 flex-center-y">
              <div class="mb-2 mb-sm-0">
                <h2 class="title lh-1 mb-2">
                  Select items to cash out
                </h2>
                <p class="caption faded-8 lh-1 mb-0 fw-semibold">
                  Min. {{ config.crypto.minWithdrawalAmount | currencyInt }} withdrawal
                </p>
              </div>

              <div class="disp-flex fw-regular flex-center">
                <v-tooltip color="grey300" bottom>
                  <template v-slot:activator="{on}">
                    <v-btn
                      :color="allSelected ? 'secondary700' : 'grey500'" class="mr-2 no-minwidth"
                      @click="selectAll" v-on="on"
                    >
                      <fai class="grey100--text" :icon="['fas','layer-group']" />
                    </v-btn>
                  </template>
                  <span>Select all</span>
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
            <v-card-text class="grey900 pt-4 text--text">
              <v-row>
                <v-col cols="12">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-card
                        v-if="currency"
                        flat color="grey500" :ripple="false"
                        class="py-2 disp-flex flex-center-y mb-3"
                        v-on="on"
                      >
                        <div class="mx-2">
                          <fai
                            class="display-2" fixed-width
                            :icon="currency.icon" :color="currency.color"
                          />
                        </div>
                        <div>
                          <h3 class="title">
                            {{ currency.name }}
                            <span class="fw-regular">({{ currency.code }})</span>
                          </h3>
                          <div class="subtitle-2 lh-1 exchange-rate">
                            <span>1 {{ currency.code }} =</span>
                            <fai class="gold--text mx-2" :icon="['fas','coins']" />
                            <span>{{ currency.rate | currencyInt }}</span>
                          </div>
                          <div class="overline grey100--text">
                            as of {{ new Date(config.crypto.updatedAt).toLocaleString() }}
                          </div>
                        </div>
                        <v-spacer />
                        <fai class="primary--text title ml-2 mr-6" :icon="['fas','caret-down']" />
                      </v-card>
                    </template>

                    <v-list color="grey500">
                      <v-list-item
                        v-for="(currency, index) in currencies"
                        :key="index"
                        @click="selectedCurrency = currency.code"
                      >
                        <v-list-item-title class="disp-flex flex-center-y">
                          <fai
                            class="title mr-1" fixed-width
                            :icon="currency.icon" :color="currency.color"
                          />
                          {{ currency.name }}
                          <span class="fw-regular ml-1">({{ currency.code }})</span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-card color="grey500" class="pa-3 my-3" flat>
                    <h4 class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1">
                      Conversion preview
                    </h4>
                    <div class="disp-flex flex-center-y currency-converter">
                      <span class="disp-flex flex-center-y body-1">
                        <fai class="mr-2 gold--text title" :icon="['fas','coins']" />
                        {{ selectedValue | currencyInt }}
                      </span>

                      <span class="mx-3 title fw-regular">
                        &#8773;
                      </span>


                      <span class="disp-flex flex-center-y body-1">
                        <fai :color="currency.color" class="mr-2 title" :icon="currency.icon" />
                        {{ cryptoAmount }}
                      </span>
                    </div>
                  </v-card>

                  <v-card color="grey500" class="pa-3 my-3" flat>
                    <h4 class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1">
                      Withdrawal Address ({{ currency.code }} only)
                    </h4>
                    <v-text-field
                      v-model="address" class="mb-1"
                      hide-details solo dense filled
                      flat background-color="grey900"
                    />
                    <v-checkbox
                      v-model="saveAddress" color="grey100"
                      hide-details class="ma-0" dense
                      label="Save locally for next time"
                    >
                      <template v-slot:label>
                        <div class="ml-n1 caption fw-semibold">
                          Save this for next time
                        </div>
                      </template>
                    </v-checkbox>
                  </v-card>

                  <div class="caption fw-semibold primary--text text-center faded-8">
                    This action is irreversible. Please check your address before confirming.
                    We take a {{ Math.round(config.crypto.withdrawPercent * 100) }}% tax for miner fees and fraud prevention.
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
          Confirm
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./cashout.js"></script>
<style lang="scss" scoped src="./cashout.scss"></style>
