<template>
  <v-row v-if="user" id="discord-reward">
    <v-col>
      <div class="font-weight-bold white--text">
        Join our Discord
      </div>
    </v-col>
    <v-col>
      <ButtonCollect :is-collected="isCollected" color="#4C596F" text="Follow $0.10" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DiscordReward',
  components: {
    ButtonCollect: () => import('@/components/Reward/ButtonCollect.vue')
  },
  props: {
    user: {
      type: Object,
      default: () => undefined
    }
  },
  computed: {
    isCollected() {
      return true
    }
  }
}
</script>
