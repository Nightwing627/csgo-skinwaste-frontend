<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-title class="text--text">
      Please confirm
    </v-card-title>
    <v-card-text v-if="user">
      Are you sure you want to use <span class="primary--text fw-bold">{{ code }}</span> as your referral code?
      <div v-if="user.affiliateCodeUsed" class="mt-2 caption text--text faded-8">
        (Your current code: {{ user.affiliateCodeUsed }})
      </div>
    </v-card-text>
    <v-card-text v-else class="text-center">
      You need to log in to redeem a referral code.
      <v-btn
        depressed
        color="primary text-unset"
        large
        class=" my-4 fw-bold"
        @click="$modal.open('auth', {maxWidth: 300, persistent: true})"
      >
        <div class="disp-flex flex-center-y">
          <fai :icon="['fab', 'steam-symbol']" class="title mr-3" />
          <span>Log in with Steam</span>
        </div>
      </v-btn>
    </v-card-text>
    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn text small @click="close">
        Cancel
      </v-btn>
      <v-btn v-show="user" color="secondary" @click="useCode">
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { sleep } from '../utils'

export default {
  props: {
    close: {
      type: Function,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    payload: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      code: this.payload.code,
      loading: false
    }
  },
  watch: {
    loading(val) {
      this.$emit('update:options', { ...this.options, persistent: val })
    }
  },
  metaInfo: {
    title: 'Confirm referral code'
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser'
    })
  },
  methods: {
    ...mapActions({
      useRefCode: 'user/useAffiliateCode'
    }),
    async useCode() {
      if (!this.code) return
      if (this.loading) return
      this.loading = true

      try {
        await this.useRefCode(this.code)
        this.user.affiliateCodeUsed = this.code
        this.$toast.open({ type: 'success', text: 'Redeemed referral code.' })
        this.close()

        // HACK
        await sleep(500)
        this.$modal.open('topup', { maxWidth: 500 })
      } catch {} finally {
        this.loading = false
      }
    }
  },
  beforeDestroy() {
    // remove ref from url
    const query = Object.assign({}, this.$route.query)
    if (query.ref) {
      delete query.ref
      this.$router.replace({ query })
    }
  }

}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
