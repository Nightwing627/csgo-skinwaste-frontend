<template>
  <v-card class="modal bdrd-3 grey500">
    <v-card-title
      class="title disp-block text-center fw-semibold text--text"
    >
      Are you sure?
    </v-card-title>
    <v-card-text class="text-center number py-6">
      Please confirm this action.
    </v-card-text>
    <v-card-actions class="pa-0">
      <v-btn
        class="ma-0 elevation-0 bdrd-tl-0 bdrd-tr-0 bdrd-bl-3 bdrd-br-0"
        color="error"
        large
        block
        @click="decline()"
      >
        <fai :icon="['fas', 'times']" class="icon headline" />
      </v-btn>
      <v-btn
        class="ma-0 elevation-0 bdrd-tl-0 bdrd-tr-0 bdrd-bl-0 bdrd-br-3"
        color="success"
        large
        block
        @click="agree()"
      >
        <fai :icon="['fas', 'check']" class="icon headline" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['close'],
  data() {
    return {
      promise: null,
      resolve: null
    }
  },
  created() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  },
  methods: {
    agree() {
      this.$emit('resolve', true)
      this.close()
    },
    decline() {
      this.$emit('resolve', false)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
