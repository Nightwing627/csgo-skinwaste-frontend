
<template>
  <div
    class="disp-flex flex-start-y mb-3"
  >
    <v-responsive width="40" aspect-ratio="1" class="text-center bdrd-1 flex-center flex-no-grow grey300">
      <fai :icon="['fas', 'exclamation-triangle']" class="headline primary--text" />
    </v-responsive>
    <div class="flex-grow px-2 bdrd-2 lh-1">
      <div class="fw-bold primary--text body-2 lh-1 mb-1 disp-flex flex-center-y">
        SYSTEM MESSAGE
      </div>
      <Message class="fw-bold body-2 lh-1 text--text" :data="message.message" />
    </div>
  </div>
</template>

<script>
import Message from './message.vue'

export default {
  name: 'ChatAnnouncement',
  components: {
    Message
  },
  props: ['message']
}
</script>
