<template>
  <div class="inner">
    <Chat />
  </div>
</template>

<script>
import Chat from './views/chat'

export default {
  name: 'ComponentSidebar',
  components: {
    Chat
  }
}
</script>

<style lang="scss" scoped>
.inner {
  width: 100%;
  height: 100%;
}
</style>
