<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title class="d-block d-sm-flex text--text flex-between-x px-3 flex-center-y">
      <div class="d-flex d-sm-block mb-1 mb-sm-0 flex-center-y flex-between-x">
        <h2 class="fw-bold title font2">
          Item Shop
        </h2>
        <div class="disp-flex body-2 flex-center-y">
          <span class="mr-2 d-none d-sm-inline">Your balance</span>
          <fai class="gold--text mr-1" :icon="['fas','coins']" />
          <span class="fw-bold">{{ user.balance | currencyInt }}</span>
          <fai class="link secondary--text ml-1" :icon="['fas','plus-circle']" @click="$modal.open('topup', {maxWidth: 500})" />
        </div>
      </div>


      <div class="disp-flex fw-regular mb-1 flex-center">
        <v-tooltip color="secondary" bottom>
          <template v-slot:activator="{on}">
            <v-btn
              :color="onlyShowAffordable ? 'secondary700 grey100--text' : 'grey500 light--text'"
              class="ma-0 mr-1 no-minwidth" v-on="on"
              @click="onlyShowAffordable = !onlyShowAffordable"
            >
              <fai class="subtitle-1" :icon="['fas','funnel-dollar']" />
            </v-btn>
          </template>
          <span>Only show affordable items</span>
        </v-tooltip>
        <v-text-field
          v-model="search"
          class="mx-2"
          background-color="grey500"
          hide-details placeholder="Search" solo dense
          flat
        />
        <v-btn
          color="grey500" class="ma-0 mdr-2 no-minwidth"
          @click="getInventory"
        >
          <fai class="grey100--text" :spin="loading" :icon="['fas','sync']" />
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="px-3 pt-3 pb-0 text-center pos-relative">
      <Inventory :items="inventory" :loading="loading" @onItemClick="selectItem" />
      <div v-show="user.balance < 1" class="no-money disp-flex flex-column flex-center">
        <fai class="gold--text display-2 mb-3" :icon="['fas','coins']" />
        <h3 class="title text-uppercase">
          Low on funds?
        </h3>
        <p class="mb-4">
          Topping up your balance is easy.
        </p>
        <v-btn
          depressed
          color="gold grey900--text"
          class="mx-4"
          @click="$modal.open('topup', {maxWidth: 500})"
        >
          Top up balance
        </v-btn>
      </div>
    </v-card-text>

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
      <div class="btns">
        <v-btn
          small text :ripple="false"
          class="px-2 fw-bold mr-2"
          @click="close"
        >
          Cancel
        </v-btn>

        <v-btn
          color="success"
          large depressed :ripple="false"
          class="px-4 px-sm-8 fw-bold"
          :loading="purchasing"
          :disabled="selectedValue > user.balance"
          @click="buy"
        >
          Buy
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./buy.js"></script>
<style lang="scss" scoped src="./buy.scss"></style>
