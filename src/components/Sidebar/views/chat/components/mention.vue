<template>
  <span class="mention mr-1 number bdrd-1">@{{ text }}</span>
</template>

<script>
export default {
  name: 'ComponentMessageMention',
  props: {
    data: {
      type: String,
      default: ''
    },
    users: {
      type: Array,
      default: Array
    }
  },
  computed: {
    text() {
      return this.data
    }
  }
}
</script>

<style lang="scss" scoped>
.mention {
  padding: 2px 4px;
  background: rgba($primary, 0.3);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba($primary, 0.5);
  }
}
</style>
