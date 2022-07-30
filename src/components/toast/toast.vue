<template>
  <v-snackbar v-model="open" v-bind="options">
    <div class="inner mr-4">
      <div v-if="icon" class="icon">
        <fai :icon="icon" />
      </div>
    </div>
    <div>
      <div v-if="title" class="title fw-bold mb-2">
        {{ title }}
      </div>
      <div class="txt number fw-semibold">
        {{ text }}
      </div>
    </div>
    <v-btn v-if="options.closable" text icon @click.native="open = false">
      <fai :icon="['fas', 'times']" size="lg" />
    </v-btn>
    <v-btn v-else-if="options.click" text icon @click.native="options.click($event, $root)">
      {{ options.clickText || 'Here' }}
    </v-btn>
    <v-spacer v-else />
    <v-progress-circular
      v-if="options.loading"
      class="ml-6"
      indeterminate
      color="text"
      :size="20"
    />
  </v-snackbar>
</template>

<script>
import { play as playSound } from '@/modules/sounds'

export default {
  name: 'Toast',
  props: {
    title: String,
    text: String,
    type: String,
    options: Object
  },
  data() {
    return {
      open: false,
      closed: false
    }
  },
  computed: {
    icon() {
      if (!this.type) return null

      const ICONS = {
        success: ['fas', 'check'],
        win: ['fas', 'check'],
        info: ['fas', 'info-circle'],
        warning: ['fas', 'exclamation-triangle'],
        error: ['fas', 'times-hexagon']
      }

      return ICONS[this.type]
    }
  },
  watch: {
    open(val) {
      if (!val && !this.closed) {
        this.close()
      }
    }
  },
  beforeMount() {
    document.getElementById('app').appendChild(this.$el)
  },
  mounted() {
    this.open = true

    const typeSound = {
      success: 'toast_success',
      error: 'toast_error',
      info: 'toast_info'
    }

    if (typeSound[this.type] && this.options.sound) {
      setTimeout(() => {
        playSound(typeSound[this.type], { volume: 0.3 })
      }, 300) // wait for animation
    }
  },
  methods: {
    close() {
      if (this.open) this.open = false
      this.closed = true
      setTimeout(() => {
        this.$options.onClose()
        this.$destroy()
        removeElement(this.$el)
      }, 400) // wait for animation
    }
  }
}

function removeElement(el) {
  if (typeof el.remove !== 'undefined') {
    el.remove()
  } else {
    el.parentNode.removeChild(el)
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-family: $body-font-family;
}

.snack.primary,
.snack.warning {
  .icon,
  .btn {
    color: $grey500 !important;
  }
}
</style>
