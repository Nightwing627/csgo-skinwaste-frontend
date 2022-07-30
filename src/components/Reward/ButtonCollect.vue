<template>
  <v-btn
    block class="text-capitalize py-7" :disabled="isCollected"
    v-bind="$attrs" v-on="$listeners"
  >
    {{ textButton }}
  </v-btn>
</template>

<script>
export default {
  name: 'ButtonCollect',
  props: {
    isCollected: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    collectedText: {
      type: String,
      default: ''
    }
  },
  computed: {
    textButton() {
      if (this.isCollected) {
        return this.collectedText || 'Collected'
      }

      return this.text
    }
  }
}
</script>
