<template>
  <v-container fluid class="py-0 full-height">
    <v-row>
      <v-col class="ma-4 bdrd-3 grey700 h100">
        <v-row dense>
          <v-col cols="auto" class="action-ctn">
            <v-text-field
              v-model="search"
              height="40"
              placeholder="Search..."
              hide-details solo dense
              flat
              outlined
              class="action-input"
              :disabled="user.balance < 1"
            >
              <template v-slot:prepend-inner>
                <fai class="mr-1 grey100--text" :icon="['fas','search']" />
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="auto" class="action-ctn">
            <v-select
              :items="weaponTypes"
              placeholder="Item Type"
              hide-details solo dense filled
              height="40"
              flat
              background-color="grey700"
              color="grey500"
              outlined
              class="action-input"
              :disabled="user.balance < 1"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="px-3 pt-3 pb-0 text-center pos-relative full-width">
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
                color="primary text--text"
                class="mx-4"
                @click="$modal.open('topup', {maxWidth: 500})"
              >
                Top up balance
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider />
        <v-row justify="end">
          <v-col cols="auto" class="py-0 mt-2">
            <v-btn
              solo filled
              height="40"
              color="primary"
              :disabled="!selected.length"
              @click="buy()"
            >
              <span class="whiteish--text fw-regular subtitle-2 text-capitalize">{{ selected.length ? `Buy ${selected.length} item${selected.length > 1 && 's'} for $${(selectedValue / 100).toFixed(2)}` : 'Please select Items to Buy' }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./shop.js"></script>
<style lang="scss" scoped src="./shop.scss"></style>
