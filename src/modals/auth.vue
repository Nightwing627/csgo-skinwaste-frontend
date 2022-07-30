<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-text class="pt-8 text-center">
      <v-progress-circular
        v-if="!popupBlocked" class="mb-4" color="primary" indeterminate
        size="48"
      />
      <fai v-else class="primary--text display-2 mb-4" :icon="['fas','exclamation-triangle']" />

      <h2 class="title mb-2" :class="{'error--text': popupBlocked}">
        {{ popupBlocked ? 'Popup blocked!' : 'Signing you in..' }}
      </h2>

      <p v-show="!popupBlocked" class="mb-5">
        A popup window should have opened with the Steam login page.
      </p>
      <p v-show="popupBlocked" class="mb-5">
        That's okay, you can click
        <a :href="authUrl" class="link fw-bold">here</a>
        to sign in the old fashioned way.
      </p>

      <v-alert
        transition="scale-transition" :value="!popupBlocked && showAlert" class="py-3" dense
        color="grey500"
      >
        <h3 class="body-2 fw-bold mb-1">
          Not seeing anything?
        </h3>
        <p class="caption mb-0">
          Your browser may have blocked the popup.
          That's okay, you can click
          <a :href="authUrl" class="link fw-bold">here</a>
          to sign in the old fashioned way.
        </p>
      </v-alert>


      <div class="mt-5 caption faded-8">
        By signing in, you agree to our
        <router-link :to="{name: 'terms'}" target="_blank" class="link">
          Terms and Conditions.
        </router-link>
      </div>
    </v-card-text>
    <v-card-actions class="flex-center">
      <v-btn text small @click="close">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showAlert: false
    }
  },
  computed: {
    ...mapGetters({
      authUrl: 'user/authUrl',
      popupBlocked: 'user/popupBlocked'
    })
  },
  async mounted() {
    setTimeout(() => {
      this.showAlert = true
    }, 2e3)

    await this.login()
    await this.getAuth()
    this.close()
  },
  methods: {
    ...mapActions({
      getAuth: 'user/getAuth',
      login: 'user/login'
    })
  }

}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
