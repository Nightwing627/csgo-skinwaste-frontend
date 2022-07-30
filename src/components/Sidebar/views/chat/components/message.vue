<template>
  <div class="disp-flex flex-center-y flex-wrap message-text">
    <component
      :is="token.type"
      v-for="(token, i) in tokens"
      :key="i"
      :data="token.payload"
    />
  </div>
</template>

<script>
import rawtext from './text'
import mention from './mention'
import emote from './emote'

export default {
  name: 'ComponentMessage',
  components: {
    rawtext,
    mention,
    emote
  },
  props: {
    data: {
      type: Array,
      default: Array
    }
  },
  computed: {
    tokens() {
      return this.data
    }
  }
}
</script>
