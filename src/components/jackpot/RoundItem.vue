<template>
  <div class="d-flex flex-wrap flex-sm-column flex-md-nowrap flex-md-row justify-center align-center align-content-center">
    <span class="primary300--text fw-semibold text-uppercase mr-2">{{ title }}</span>
    <span v-if="trunc" class="grey100--text fw-regular">{{ content | truncate(32) }}</span>
    <span v-else class="grey100--text fw-regular">{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: 'RoundItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Number],
      default: ''
    },
    trunc: {
      type: Number,
      default: 0
    }
  }
}
</script>
