<template>
  <v-card class="modal bdrd-2">
    <v-card-title class="grey700 px-4 flex-between-x flex-start-y grey100--text">
      {{ user.rank === 2 ? 'Mod' : 'Admin' }} Panel
    </v-card-title>

    <v-tabs
      v-model="tab"
      show-arrows
      background-color="grey700"
    >
      <v-tab v-if="hasPermission(permissions.CAN_VIEW_STATS)" :ripple="false">
        Stats
      </v-tab>
      <v-tab v-if="hasPermission(permissions.VIEW_CONFIGS)" :ripple="false">
        Config
      </v-tab>
      <v-tab v-if="hasPermission(permissions.VIEW_USER)" :ripple="false">
        Users
      </v-tab>
      <v-tab v-if="hasPermission(permissions.VIEW_USER)" :ripple="false">
        User
      </v-tab>
    </v-tabs>

    <v-card-text class="pa-0 text--text grey900 full-height" style="max-height: 900px;">
      <v-tabs-items v-model="tab" class="grey900">
        <!-- stats -->
        <v-tab-item v-if="hasPermission(permissions.CAN_VIEW_STATS)" eager class="grey900 pa-3">
          <view-stats />
        </v-tab-item>

        <!-- config -->
        <v-tab-item v-if="hasPermission(permissions.VIEW_CONFIGS)" eager class="grey900 pa-3">
          <view-config />
        </v-tab-item>

        <!-- user inspection -->
        <v-tab-item v-if="hasPermission(permissions.VIEW_USER)" eager class="grey900 pa-3">
          <view-users ref="viewUsers" :look-up-user="lookUpUser" />
        </v-tab-item>
        <v-tab-item v-if="hasPermission(permissions.VIEW_USER)" eager class="grey900 pa-3">
          <view-user ref="viewUser" />
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions class="pa-4 grey900 flex-end-x">
      <div class="btns">
        <v-btn
          small text :ripple="false"
          class="px-2 fw-bold"
          @click="close"
        >
          Close
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script src="./admin.js"></script>
<style lang="scss" scoped src="./admin.scss"></style>
