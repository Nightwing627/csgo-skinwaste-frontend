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
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn
              solo filled
              height="40"
              color="primary"
              to="shop"
            >
              <span class="text--text">Go to the Shop</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" class="inventory-body mb-2">
            <Inventory :items="filteredItems" :loading="loading" @onItemClick="selectItem" />
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
              @click="sell()"
            >
              <span class="whiteish--text fw-regular subtitle-2 text-capitalize">{{ selected.length ? `Sell ${selected.length} item${selected.length > 1 && 's'} for $${(selectedValue / 100).toFixed(2)}` : 'Please select Items to Sell' }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./inventory.js"></script>
<style lang="scss" scoped src="./inventory.scss"></style>
