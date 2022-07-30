<template>
  <div class="volume-icon full-height disp-flex flex-center px-5" @click="toggleMute(!muted)">
    <fai fixed-width :icon="['fas', icon]" class="title link primary--text" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'VolumeControl',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['muted']),
    icon() {
      if (this.muted) return 'volume-mute'
      return 'volume-up'
    }
  },

  mounted() {
    if (this.$ls.get('volMuted') !== null) {
      this.setMute(this.$ls.get('volMuted'))
    }
  },
  methods: {
    ...mapMutations(['setMute']),
    toggleMute(val) {
      this.setMute(val)
      this.$ls.set('volMuted', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.volume-icon {
  border-right: 1px solid rgba($light, 0.2);
  border-left: 1px solid rgba($light, 0.2);
  transition: background 0.3s ease;

  &:hover {
    background: $grey100;
    cursor: pointer;
  }
}
</style>
