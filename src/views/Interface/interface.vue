<template>
  <v-app>
    <div
      class="background-image"
      :style="{
        background: `url(${require('@/assets/img/BackgroundImage.png')}) no-repeat center center fixed !important`,
        backgroundSize: `cover !important`
      }"
    />
    <!-- mobile nav -->
    <v-bottom-navigation
      v-if="$vuetify.breakpoint.mdAndDown"
      class="mobile-nav"
      app
      light
      background-color="gredy100"
      color="primary"
      :grow="$vuetify.breakpoint.width < 400"
      height="64"
    >
      <v-btn :ripple="false" @click="$emit('chatOpen')">
        <span class="fw-bold grey900--text text-uppercase">Chat</span>
        <fai class="title primary--text mb-2" icon="comments" />
      </v-btn>

      <v-btn :ripple="false" @click="$emit('navSidebar')">
        <span class="fw-bold grey900--text text-uppercase">Menu</span>
        <fai class="title primary--text mb-2" icon="bars" />
      </v-btn>

      <v-btn
        v-show="user"
        :ripple="false"
        @click="$modal.open('buy', { maxWidth: 900 })"
      >
        <span class="fw-bold grey900--text text-uppercase">Shop</span>
        <fai class="title primary--text mb-2" icon="coins" />
      </v-btn>

      <v-menu v-if="user" top offset-y>
        <template v-slot:activator="{ on }">
          <v-btn :ripple="false" v-on="on">
            <span class="fw-bold grey900--text text-uppercase">User</span>
            <fal class="title mb-2 mr-2 primary--text">
              <fai icon="user" />
              <fai icon="caret-up" transform="shrink-5 right-13" />
            </fal>
          </v-btn>
        </template>

        <v-list class="grey300">
          <v-list-item
            :ripple="false"
            @click="$modal.open('account', { maxWidth: 600 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fas', 'user']"
                fixed-width
                class="icon primary--text"
              />
            </v-list-item-action>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
          <v-list-item
            :ripple="false"
            @click="$modal.open('topup', { maxWidth: 500 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fas', 'coins']"
                fixed-width
                class="icon primary--text"
              />
            </v-list-item-action>
            <v-list-item-title>Top up balance</v-list-item-title>
          </v-list-item>
          <v-list-item
            :ripple="false"
            @click="$modal.open('sell', { maxWidth: 900 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fas', 'exchange-alt']"
                fixed-width
                class="icon primary--text"
              />
            </v-list-item-action>
            <v-list-item-title>Sell items</v-list-item-title>
          </v-list-item>
          <v-list-item
            :ripple="false"
            @click="$modal.open('cashout', { maxWidth: 400 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fab', 'ethereum']"
                fixed-width
                class="icon primary--text"
              />
            </v-list-item-action>
            <v-list-item-title>Crypto Cashout</v-list-item-title>
          </v-list-item>
          <v-list-item
            class="gold"
            :ripple="false"
            @click="$modal.open('csgocashout', { maxWidth: 900 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <!-- <img class="gun-icon mr-1" src="@/assets/img/gun-icon.png" alt="gun icon"> -->
              <fai
                :icon="['fas', 'grin-stars']"
                fixed-width
                class="headline grey900--text"
              />
            </v-list-item-action>
            <v-list-item-title class="grey900--text fw-black">
              CS:GO Cashout
            </v-list-item-title>
          </v-list-item>
          <v-list-item :ripple="false" @click="logout()">
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fas', 'sign-out']"
                fixed-width
                class="icon primary--text"
              />
            </v-list-item-action>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user.rank >= 2 && hasPermission(permissions.VIEW_PANEL)"
            class="primary"
            :ripple="false"
            @click="$modal.open('admin', { maxWidth: 900 })"
          >
            <v-list-item-action class="disp-flex mr-3 flex-center">
              <fai
                :icon="['fas', 'cogs']"
                fixed-width
                class="icon grey100--text"
              />
            </v-list-item-action>
            <v-list-item-title>Admin panel</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-else
        color="primary"
        :ripple="false"
        @click="$modal.open('auth', { maxWidth: 300, persistent: true })"
      >
        <span class="fw-bold grey100--text text-uppercase">Sign in</span>
        <fai :icon="['fab', 'steam-symbol']" class="title mb-2 grey100--text" />
      </v-btn>
    </v-bottom-navigation>
    <!-- <user /> -->

    <v-app-bar
      v-if="$vuetify.breakpoint.mdAndDown"
      fixed
      flat
      clipped-right
      height="70"
      color="grey500"
    >
      <div v-if="user" class="disp-flex flex-center-y " style="width:100%;">
        <user />
        <div
          class="balance disp-flex flex-center-y flex-center-x text--text px-3 py-2 bdrd-2 mr-3 ml-auto"
        >
          <fai
            :icon="['far', 'dollar-sign']"
            class="mr-2 grey100--text subtitle-2"
          />
          <span class="subtitle-2">{{ userBalance | currencyInt }}</span>
          <div
            class="bdrd-2 grad-secondary deposit cursor-pointer"
            @click="$modal.open('topup', { maxWidth: 530 })"
          >
            <fai :icon="['fas', 'plus']" class="text--text subtitle-2" />
          </div>
        </div>
      </div>
    </v-app-bar>

    <v-content app class="content-ctn">
      <v-app-bar
        v-model="showNavbar"
        flat
        clipped-left
        clipped-right
        class="disp-flex flex-rcolumn navbar"
        color="grey500"
        height="70"
        :hide-on-scroll="$vuetify.breakpoint.xs"
        :class="{ invisible: $vuetify.breakpoint.xs }"
      >
        <Navbar :is-authenticated="Boolean(user)" />
        <v-spacer v-show="$vuetify.breakpoint.xs" />
        <v-spacer v-show="$vuetify.breakpoint.smAndUp" />
        <div
          v-if="user && $vuetify.breakpoint.smAndUp"
          class="disp-flex flex-center-y"
        >
          <div
            class="balance disp-flex flex-center-y flex-center-x text--text px-3 py-2 bdrd-2 mr-3"
          >
            <fai
              :icon="['far', 'dollar-sign']"
              class="mr-2 grey100--text subtitle-2"
            />
            <span class="subtitle-2">{{ userBalance | currencyInt }}</span>
            <div
              class="bdrd-2 grad-secondary deposit cursor-pointer"
              @click="$modal.open('topup', { maxWidth: 530 })"
            >
              <fai :icon="['fas', 'plus']" class="text--text subtitle-2" />
            </div>
          </div>
        </div>
        <volume-control v-show="$vuetify.breakpoint.smAndUp" />
        <user v-if="$vuetify.breakpoint.smAndUp" />
      </v-app-bar>
      <!-- <game-status-bar /> -->
      <transition name="v-page-transition" mode="out-in">
        <slot />
      </transition>
    </v-content>
  </v-app>
</template>

<script src="./interface.js"></script>
<style lang="scss" scoped src="./interface.scss"></style>
