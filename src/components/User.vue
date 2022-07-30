<template>
  <v-menu
    v-if="user" v-model="dropdownActive" bottom right
    offset-y
  >
    <template v-slot:activator="{ on }">
      <div
        class="user-ctn disp-flex flex-center-y pl-4 pr-8"
        :class="{'menu-active': dropdownActive}"
        v-on="on"
      >
        <v-img :src="user.avatar" width="50" class="mr-3 bdrd-circle" />

        <fai :icon="['fas', 'caret-down']" class="primary--text title" />
      </div>
    </template>

    <v-list class="grey300">
      <v-list-item :ripple="false" @click="$modal.open('account', {maxWidth: 600})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fas', 'user']" fixed-width class="icon primary--text" />
        </v-list-item-action>
        <v-list-item-title>Account</v-list-item-title>
      </v-list-item>
      <v-list-item :ripple="false" @click="$modal.open('topup', {maxWidth: 500})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fas', 'coins']" fixed-width class="icon primary--text" />
        </v-list-item-action>
        <v-list-item-title>Top up balance</v-list-item-title>
      </v-list-item>
      <v-list-item v-show="$vuetify.breakpoint.smAndDown" :ripple="false" @click="$modal.open('sell', {maxWidth: 900})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fas', 'exchange-alt']" fixed-width class="icon primary--text" />
        </v-list-item-action>
        <v-list-item-title>Sell items</v-list-item-title>
      </v-list-item>
      <v-list-item :ripple="false" @click="$modal.open('cashout', {maxWidth: 400})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fab', 'ethereum']" fixed-width class="icon primary--text" />
        </v-list-item-action>
        <v-list-item-title>Crypto Cashout</v-list-item-title>
      </v-list-item>
      <v-list-item class="gold" :ripple="false" @click="$modal.open('csgocashout', {maxWidth: 900})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <!-- <img class="gun-icon mr-1" src="@/assets/img/gun-icon.png" alt="gun icon"> -->
          <fai :icon="['fas', 'grin-stars']" fixed-width class="headline grey900--text" />
        </v-list-item-action>
        <v-list-item-title class="grey900--text fw-black">
          CS:GO Cashout
        </v-list-item-title>
      </v-list-item>
      <v-list-item :ripple="false" @click="logout()">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fas', 'sign-out']" fixed-width class="icon primary--text" />
        </v-list-item-action>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="user.rank === 3" class="primary" :ripple="false" @click="$modal.open('admin', {maxWidth: 900})">
        <v-list-item-action class="disp-flex mr-3 flex-center">
          <fai :icon="['fas', 'cogs']" fixed-width class="icon grey100--text" />
        </v-list-item-action>
        <v-list-item-title>Admin panel</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-btn
    v-else
    depressed
    color="primary text-unset"
    large
    class=" mx-4 fw-bold"
    @click="$modal.open('auth', {maxWidth: 300, persistent: true})"
  >
    <div class="disp-flex flex-center-y">
      <fai :icon="['fab', 'steam-symbol']" class="title mr-3" />
      <span>Log in with Steam</span>
    </div>
  </v-btn>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import UserLevel from './UserLevel.vue'

export default {
  name: 'User',
  components: {
    UserLevel
  },
  data() {
    return {
      dropdownActive: false
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout'
    })
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser'
    })
  }
}
</script>


<style lang="scss" scoped>
.user-ctn {
  height: 100%;
  transition: background 0.3s ease;

  &:hover {
    background: $grey100;
    cursor: pointer;
  }
}
</style>
