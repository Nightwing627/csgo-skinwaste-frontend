<template>
  <v-card class="modal bdrd-2">
    <v-card-title class="text--text grey700 flex-between-x px-4 flex-center-y">
      <h2 class="title">
        Cash out balance
      </h2>

      <div
        class="disp-flex body-1 fw-regular disp-flex flex-center-y"
        :class="{ 'primary--text': amount * 100 > user.balance }"
      >
        <fai class="gold--text mr-2" :icon="['fas', 'coins']" />
        {{ user.balance | currencyInt }}
        <fai
          class="grey100--text link ml-2 body-2"
          :spin="loading.balance"
          :icon="['fas', 'sync']"
          @click="refreshBalance()"
          @click.stop
        />
      </div>
    </v-card-title>

    <v-card-text class="grey900 pt-4 text--text">
      <v-row>
        <v-col cols="12">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-card
                v-if="currency"
                flat
                color="grey500"
                :ripple="false"
                class="py-2 disp-flex flex-center-y mb-3"
                v-on="on"
              >
                <div class="mx-2" style="min-width:40px;">
                  <v-img
                    width="100%"
                    max-width="40"
                    :aspect-ratio="1"
                    contain
                    class="bdrd-circle link flex-no-grow"
                    :src="
                      require(`@/assets/img/coins/${currency.code}-logo.svg`)
                    "
                  />
                </div>
                <div>
                  <h3 class="title">
                    {{ currency.name }}
                    <span class="fw-regular">({{ currency.code }})</span>
                  </h3>
                  <div class="subtitle-2 lh-1 exchange-rate">
                    <span>1 {{ currency.code }} =</span>
                    <fai class="gold--text mx-2" :icon="['fas', 'coins']" />
                    <span>{{ currency.rate | currencyInt }}</span>
                  </div>
                  <div class="overline grey100--text">
                    as of
                    {{ new Date(config.crypto.updatedAt).toLocaleString() }}
                  </div>
                </div>
                <v-spacer />
                <fai
                  class="primary--text title ml-2 mr-6"
                  :icon="['fas', 'caret-down']"
                />
              </v-card>
            </template>

            <v-list color="grey500">
              <v-list-item
                v-for="(currency, index) in currencies"
                v-if="currency.code == 'LTC' || currency.code == 'ETH'"
                :key="index"
                @click="selectedCurrency = currency.code"
              >
                <v-list-item-title class="disp-flex flex-center-y">
                  <v-img
                    width="100%"
                    max-width="20"
                    :aspect-ratio="1"
                    contain
                    class="bdrd-circle link flex-no-grow"
                    :src="
                      require(`@/assets/img/coins/${currency.code}-logo.svg`)
                    "
                  />
                  <span class="ml-1">{{ currency.name }}</span>
                  <span class="fw-regular ml-1">({{ currency.code }})</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-card color="grey500" class="pa-3 my-3" flat>
            <h4
              class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1"
            >
              Enter amount
            </h4>
            <div class="disp-flex flex-center-y currency-converter">
              <v-text-field
                v-model.number="amount"
                hide-details
                solo
                dense
                filled
                flat
                background-color="grey900"
                color="grey100"
                :error="amount * 100 < config.crypto.minWithdrawalAmount"
                class="input-coins"
                type="number"
                @input="getGasFee"
                @change="getGasFee"
              >
                <template v-slot:prepend-inner>
                  <fai class="mr-1 gold--text title" :icon="['fas', 'coins']" />
                </template>
              </v-text-field>

              <span class="mx-3 title fw-regular">
                &#8773;
              </span>

              <span class="disp-flex flex-center-y body-1">
                <!-- <fai :color="currency.color" class="mr-2 title" :icon="currency.icon" /> -->
                <v-img
                  width="100%"
                  max-width="22"
                  :aspect-ratio="1"
                  contain
                  class="bdrd-circle link flex-no-grow mr-1"
                  :src="require(`@/assets/img/coins/${currency.code}-logo.svg`)"
                />
                {{ cryptoAmount }}
              </span>
            </div>
          </v-card>

          <v-card color="grey500" class="pa-3 my-3" flat>
            <h4
              class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1"
            >
              Withdrawal Address ({{ currency.code }} only)
            </h4>
            <v-text-field
              v-model="address"
              class="mb-1"
              hide-details
              solo
              dense
              filled
              flat
              background-color="grey900"
              @input="getGasFee"
              @change="getGasFee"
            />
            <v-checkbox
              v-model="saveAddress"
              color="grey100"
              hide-details
              class="ma-0"
              dense
              label="Save locally for next time"
            >
              <template v-slot:label>
                <div class="ml-n1 caption fw-semibold">
                  Save this for next time
                </div>
              </template>
            </v-checkbox>
          </v-card>

          <v-card
            v-if="currency.code == 'ETH' && gasFee"
            color="grey500"
            class="pa-3 my-3"
            flat
          >
            <h4
              class="caption text-uppercase fw-semibold grey100--text faded-8 mb-1"
            >
              Gas Fee ({{ currency.code }} only)
            </h4>
            <h4 class="caption text-uppercase fw-semibold">
              Estimated Network Fee &#8773;
              <span
                :class="
                  `${
                    gasFee < 5
                      ? 'green--text'
                      : gasFee < 10
                        ? 'orange--text'
                        : 'red--text'
                  }`
                "
              >${{ (gasFee * 100) | currencyInt }}</span>
            </h4>
          </v-card>

          <div
            class="caption lh-1-2 fw-semibold primary--text text-center faded-8"
          >
            This action is irreversible. Please check your address before
            confirming. We take a
            {{ Math.round(config.crypto.withdrawPercent * 100) }}% tax for miner
            fees and fraud prevention.
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn
        small text :ripple="false" class="px-2 fw-bold"
        @click="close"
      >
        Close
      </v-btn>
      <v-btn
        color="success"
        large
        depressed
        :ripple="false"
        class="px-8 fw-bold"
        :disabled="!canWithdraw"
        :loading="loading.withdraw"
        @click="cashout"
      >
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./cashout.js"></script>
<style lang="scss" scoped src="./cashout.scss"></style>
