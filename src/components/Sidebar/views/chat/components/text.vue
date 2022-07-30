<template>
  <span class="mr-1">{{ text }}</span>
</template>

<script>
export default {
  name: 'ComponentMessageText',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  computed: {
    text() {
      return this.data
    }
  }
}
</script>
