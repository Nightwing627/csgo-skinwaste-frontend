<template>
  <v-dialog v-model="open" attach :fullscreen="$vuetify.breakpoint.xs" v-bind="localOptions">
    <component
      :is="component"
      :payload="payload"
      :options.sync="localOptions"
      :close="close"
      @resolve="onResolve"
      @reject="onReject"
    />
  </v-dialog>
</template>

<script>

export default {
  name: 'ModalContainer',
  props: {
    component: [Object, Function],
    programmatic: Boolean,
    options: Object,
    payload: Object
  },
  data() {
    return {
      open: false,
      closed: false,
      confirmation: null,
      resolve: null,
      reject: null,
      localOptions: this.options
    }
  },
  watch: {
    open(val) {
      if (!val && !this.closed) {
        this.close()
        if (this.confirmation) this.resolve(false)
      }
    }
  },
  beforeMount() {
    document.getElementById('app').appendChild(this.$el)
  },
  created() {
    this.open = true

    if (this.options.isConfirm) {
      this.confirmation = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    }
  },
  methods: {
    onResolve(val) {
      this.resolve(val)
    },
    onReject(val) {
      this.reject(val)
    },
    close() {
      if (this.open) this.open = false
      this.closed = true

      setTimeout(() => {
        if (this.$options.onClose) this.$options.onClose()
        this.$destroy()
        removeElement(this.$el)
      }, 300)
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
::v-deep .v-dialog {
  overflow: visible;

  &.v-dialog--fullscreen .modal {
    border-radius: 0 !important;
  }

  &.no-shadow {
    box-shadow: none !important;
  }
}

::v-deep .v-card.modal {
  overflow: hidden;
  width: 100%;
  background: $grey700;

  > .v-card__title,
  > .v-card__actions {
    position: relative;
    z-index: 1;
    color: $text-invert;
  }

  > .v-card__text {
    overflow-y: auto;
  }

  > .v-card__actions {
    .btn {
      margin: 0 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
