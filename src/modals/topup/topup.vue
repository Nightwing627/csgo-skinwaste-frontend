<template>
  <v-card class="modal bdrd-2">
    <v-card-title class="text--text grey700 flex-between-x px-4 flex-center-y">
      <h2 class="title d-flex flex-center-y">
        <fai :icon="['fas', 'plus']" class="caption primary--text mr-2" />Deposit
      </h2>

      <div
        class="disp-flex body-1 fw-regular disp-flex flex-center-y cursor-pointer"
      >
        <fai
          class="grey100--text link ml-2 body-2"
          :icon="['fas', 'times']"
          @click="close"
        />
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0 grey700 text--text">
      <v-stepper v-model="step" class="bdrd-0 grey700 elevation-0">
        <v-stepper-items>
          <v-stepper-content class="px-6 pt-2" step="1">
            <v-row>
              <v-col cols="12">
                <h2 class="title">
                  1. Choose a payment method.
                </h2>
                <p class="body-1 mb-1 grey100--text">
                  Pick a payment method below to get started. Prices are
                  retrieved hourly from CoinMarketCap.
                </p>
              </v-col>

              <v-col class="py-2" cols="12">
                <v-card
                  flat
                  color="grey500"
                  :class="{ selected: selectedCurrency === 'rust' && !csgo }"
                  class="currency px-4 py-3 disp-flex flex-center-y mb-3"
                  :ripple="false"
                  @click=" () => {
                    close()
                    $modal.open('rust')
                    csgo = false;
                  }
                  "
                >
                  <!-- close() -->
                  <div
                    v-show="user.affiliateCodeUsed"
                    class="deposit-bonus bdrd-0"
                  >
                    +{{
                      Math.round(config.affiliate.referralDepositBonus * 100)
                    }}%
                  </div>
                  <div class="mr-4" style="min-width:40px;">
                    <!-- <fai
                      class="display-3" fixed-width
                      :icon="currency.icon" :color="currency.color"
                    /> -->
                    <v-img
                      width="100%"
                      max-width="40"
                      :aspect-ratio="1"
                      contain
                      class="link flex-no-grow"
                      :src="require(`@/assets/img/rust.png`)"
                    />
                  </div>
                  <div>
                    <h3 class="title lh-1 mb-2">
                      Rust
                    </h3>
                    <div class="subtitle-2 lh-1 exchange-rate">
                      <span>Deposit Rust skins via RustySell</span>
                    </div>
                  </div>
                </v-card>
                <v-card
                  flat
                  color="grey500"
                  :class="{ selected: selectedCurrency === 'rust' && !csgo }"
                  class="currency px-4 py-3 disp-flex flex-center-y mb-3"
                  :ripple="false"
                  @click=" () => {
                    close()
                    $modal.open('skinsback')
                    csgo = false;
                  }
                  "
                >
                  <!-- close() -->
                  <div
                    v-show="user.affiliateCodeUsed"
                    class="deposit-bonus bdrd-0"
                  >
                    +{{
                      Math.round(config.affiliate.referralDepositBonus * 100)
                    }}%
                  </div>
                  <div class="mr-4" style="min-width:40px;">
                    <!-- <fai
                      class="display-3" fixed-width
                      :icon="currency.icon" :color="currency.color"
                    /> -->
                    <v-img
                      width="100%"
                      max-width="40"
                      :aspect-ratio="1"
                      contain
                      class="link flex-no-grow"
                      :src="require(`@/assets/img/csgo.png`)"
                    />
                  </div>
                  <div>
                    <h3 class="title lh-1 mb-2">
                      CSGO & Dota2
                    </h3>
                    <div class="subtitle-2 lh-1 exchange-rate">
                      <span>Deposit CSGO & Dota2 skins via SkinsBack</span>
                    </div>
                  </div>
                </v-card>
                <!-- crypto -->
                <v-card
                  v-for="(currency, i) in currencies"
                  :key="i"
                  flat
                  color="grey500"
                  :class="{
                    selected: selectedCurrency === currency.id && !csgo
                  }"
                  class="currency px-4 py-3 disp-flex flex-center-y mb-3"
                  :ripple="false"
                  @click="
                    select(currency.id);
                    csgo = false;
                  "
                >
                  <div
                    v-show="user.affiliateCodeUsed"
                    class="deposit-bonus bdrd-0"
                  >
                    +{{
                      Math.round(config.affiliate.referralDepositBonus * 100)
                    }}%
                  </div>
                  <div class="mr-4" style="min-width:40px;">
                    <!-- <fai
                      class="display-3" fixed-width
                      :icon="currency.icon" :color="currency.color"
                    /> -->
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
                    <h3 class="title lh-1 mb-2">
                      {{ currency.name }}
                      <span class="fw-regular">({{ currency.code }})</span>
                      <span
                        v-if="
                          currency.code == 'USDT' || currency.code == 'USDC'
                        "
                        class="subtitle-2 grey100--text ml-1"
                      >(TRC-20)</span>
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
                </v-card>
              </v-col>

              <v-col class="py-0 mb-2" cols="12">
                <v-divider />
              </v-col>

              <v-col cols="12">
                <v-card color="grey300" class="pa-3 mb-3" flat>
                  <h4 class="subtitle-2 fw-bold secondary--text">
                    Free Deposit bonus
                  </h4>
                  <p>
                    Enter a referral code and we'll add a
                    <span
                      class="gold--text fw-bold"
                    >{{
                      Math.round(config.affiliate.referralDepositBonus * 100)
                    }}%</span>
                    bonus on <b>every single deposit</b> you make,
                    <em>forever</em>.
                  </p>
                  <div class="disp-flex pos-relative refcode-form">
                    <v-text-field
                      v-model="localRefCode"
                      class="flex-grow"
                      hide-details
                      solo
                      dense
                      filled
                      :readonly="!!user.affiliateCodeUsed"
                      placeholder="Enter code"
                      :success="!!user.affiliateCodeUsed"
                      :prepend-inner-icon="
                        user.affiliateCodeUsed ? 'mdi-check' : ''
                      "
                      flat
                      background-color="grey500"
                    />
                    <v-btn
                      v-show="!user.affiliateCodeUsed"
                      color="secondary700"
                      :ripple="false"
                      class="ml-2 unheight"
                      :loading="settingCode"
                      @click="useCode"
                    >
                      Redeem code
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-content class="px-6 pt-2" step="2">
            <v-row>
              <v-col v-if="currency" cols="12">
                <h2 class="title">
                  2. Send it over
                </h2>
                <p class="body-1 lh-1-2 grey100--text mb-2">
                  Once you've sent your chosen amount, you can close this popup.
                  You'll be notified once your balance has been credited.
                </p>
                <p
                  v-if="currency.code === 'USDT' || currency.code === 'USDC'"
                  class="caption body-1 lh-1-2 danger--text mb-2"
                >
                  We do NOT accept ERC-20 USDT or USDC. Sending on the wrong
                  network will result in a permanent loss of your funds
                </p>
                <p
                  v-if="currency.code === 'ETH'"
                  class="caption body-1 lh-1-2 danger--text mb-2"
                >
                  WARNING: Since we use a payment provider to forward coins, the
                  network fees can be very expensive. You may receive much less
                  than you deposited for lower amounts. We recommend you use our
                  other deposit methods.
                </p>
                <div
                  class="caption mb-5 grey100--text fw-bold"
                  style="display:flex;"
                >
                  <fai icon="exclamation-triangle" class="gold--text mr-1" style="margin-top:0.3em;" />
                  Min. deposit:
                  <v-img
                    width="100%"
                    :max-width="currency.code == 'ETH'?12:20"
                    class="mx-1 "
                    :src="
                      require(`@/assets/img/coins/${currency.code}-logo.svg`)
                    "
                  />
                  {{ currency.minDeposit.toFixed(Math.max(2, (currency.minDeposit.toString().split('.')[1] || []).length)) }}
                </div>

                <div v-show="csgo" class="grey500 mt-2 pa-3 bdrd-2">
                  <h3 class="subtitle-2">
                    CS:GO Deposits
                  </h3>
                  <p class="caption lh-1-5 fw-semibold mb-0">
                    To deposit CS:GO skins, you can convert your skins to
                    Ethereum using an exchange website like
                    <a
                      href="https://money4skins.com/sellskins"
                      target="_blank"
                      class="link"
                    >Money4Skins</a>
                    or
                    <a
                      href="https://skins.cash" target="_blank" class="link"
                    >skins.cash</a>. Any websites or cryptobots work, these are just our
                    recommendations.
                    <span
                      class="fw-bold"
                    >Make sure you give them the deposit address below when
                      cashing out and stay safe.</span>
                  </p>
                </div>

                <v-skeleton-loader
                  v-if="!address"
                  height="60"
                  class="my-3"
                  type="card"
                />
                <v-card
                  v-else
                  color="grey500 disp-flex flex-center-y transaction-info my-3"
                  class="pa-3"
                  flat
                >
                  <div class="flex-grow">
                    <h4 class="overline fw-black text--text faded-8">
                      Deposit Address ({{ currency.code }} only)
                    </h4>
                    <input
                      :value="address"
                      onclick="this.select()"
                      class="full-width text--text  body-2"
                      type="text"
                      readonly
                    >
                  </div>

                  <v-tooltip v-model="copied" color="secondary" top>
                    <template v-slot:activator="{ on }">
                      <fai
                        :icon="['fas', 'copy']"
                        class="title flex-no-shrink mr-3 link grey100--text faded-5"
                        @click="copy"
                      />
                    </template>
                    <span>Copied</span>
                  </v-tooltip>

                  <fai
                    :icon="['fas', 'qrcode']"
                    class="title flex-no-shrink mr-2 link grey100--text faded-5"
                    @click="
                      $modal.open(
                        'qrcode',
                        { maxWidth: 400 },
                        { data: address }
                      )
                    "
                  />
                </v-card>

                <!-- <v-row>
                  <v-col cols="6">
                    <v-card color="grey700" class="pa-3  disp-flex flex-center-y my-3" flat />
                  </v-col>
                  <v-col cols="6">
                    <v-card color="grey700" class="pa-3  disp-flex flex-center-y my-3" flat />
                  </v-col>
                </v-row> -->

                <v-card
                  color="grey500 currency-converter-ctn"
                  :class="{ bonus: !!user.affiliateCodeUsed }"
                  class="pa-3 my-3"
                  flat
                >
                  <h4 class="overline fw-black grey100--text faded-8 mb-2">
                    Conversion Preview
                  </h4>
                  <!-- <p>
                    {{ amount | currencyInt }}
                  </p> -->
                  <div
                    v-show="user.affiliateCodeUsed"
                    class="deposit-bonus bdrd-0"
                  >
                    +{{
                      Math.round(config.affiliate.referralDepositBonus * 100)
                    }}%
                  </div>
                  <div class="disp-flex flex-center-y currency-converter">
                    <v-text-field
                      v-model.number="conversion.coins"
                      hide-details
                      solo
                      dense
                      filled
                      flat
                      background-color="grey900"
                      color="grey100"
                      class="input-coins"
                      type="number"
                      @input="updateCryptoAmount"
                    >
                      <template v-slot:prepend-inner>
                        <fai
                          class="mr-1 gold--text title"
                          :icon="['fas', 'coins']"
                        />
                      </template>
                    </v-text-field>

                    <span class="mx-3 title fw-regular">
                      &#8773;
                    </span>

                    <v-text-field
                      v-model.number="conversion.crypto"
                      hide-details
                      solo
                      dense
                      filled
                      flat
                      background-color="grey900"
                      color="grey100"
                      :error="
                        conversion.crypto
                          ? conversion.crypto < currency.minDeposit
                          : false
                      "
                      @input="updateCoinsAmount"
                    >
                      <template v-slot:prepend-inner>
                        <v-img
                          width="100%"
                          min-width="16"
                          :max-width="currency.code == 'ETH'?16:24"
                          class="mx-1"
                          :src="
                            require(`@/assets/img/coins/${currency.code}-logo.svg`)
                          "
                        />
                      </template>
                    </v-text-field>
                  </div>
                </v-card>

                <div class="caption text-center faded-5">
                  Tip: Your address doesn't change and can receive deposits at
                  any time.
                </div>
              </v-col>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-between-x">
      <v-btn
        v-if="step > 1"
        small
        text
        :ripple="false"
        class="px-2 fw-bold mr-2"
        @click="step > 1 && step--"
      >
        Back
      </v-btn>
      <v-spacer v-else />

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

<script src="./topup.js"></script>
<style lang="scss" scoped src="./topup.scss"></style>
