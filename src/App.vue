<template>
  <router-view />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(
      {
        user: 'user/getUser'
      },
      ['ready']
    )
  },
  watch: {
    // eslint-disable-next-line func-names
    '$store.state.config.site': async function (newVal) {
      await this.getAuth()
      if (
        newVal.maint.enabled
          && this.$route.name !== 'maintenance'
          && this.user.rank !== 3
      ) {
        this.$router.push({ name: 'maintenance' })
      } else if (
        newVal.countdown.enabled
          && this.$route.name !== 'countdown'
          && this.user.rank !== 3
      ) {
        this.$router.push({ name: 'countdown' })
      } else if (
        (this.$route.name === 'maintenance' && !newVal.maint.enabled)
        || (this.$route.name === 'countdown' && !newVal.countdown.enabled)
      ) {
        if (this.user.rank !== 3) { this.$router.push({ name: 'home', params: { lang: 'en' } }) }
      }
    }
  },
  async created() {
    try {
      await this.getConfig()
      this.$store.commit('setReady', true)

      const maintenance = this.$store.getters.config.site.maint
      const isMaintenance = maintenance.enabled
      const { countdown } = this.$store.getters.config.site
      const isCountdown = countdown.enabled

      await this.getAuth()

      if (
        isMaintenance
        && this.$route.name !== 'maintenance'
        && this.user.rank !== 3
      ) {
        this.$router.push({ name: 'maintenance' })
      } else if (
        isCountdown
        && this.$route.name !== 'countdown'
        && this.user.rank !== 3
      ) {
        this.$router.push({ name: 'countdown' })
      } else if (
        (this.$route.name === 'maintenance' && !isMaintenance)
        || (this.$route.name === 'countdown' && !isCountdown)
      ) {
        if (this.user.rank !== 3) { this.$router.push({ name: 'home', params: { lang: 'en' } }) }
      }
    } catch (e) {
      console.error('Network error while loading app:', e)
      // TODO: show error on overlay
    }
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit('setLoading', false)

      const loader = document.getElementById('appLoader')
      if (!loader) return // ex: HMR

      loader.classList.add('outtahere')

      setTimeout(() => {
        loader.parentNode.removeChild(loader)
      }, 800)
    }, 500)
  },
  metaInfo: {
    title: 'Home',
    titleTemplate: '%s :: Skinwaste'
  },
  methods: {
    ...mapActions({ getConfig: 'getConfig', getAuth: 'user/getAuth' })
  }
}
</script>
