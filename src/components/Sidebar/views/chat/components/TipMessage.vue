
<template>
  <div
    class="disp-flex flex-start-y"
  >
    <v-responsive width="40" aspect-ratio="1" class="text-center bdrd-1 flex-center flex-no-grow grey300">
      <fai :icon="['fas', 'heart']" class="headline info--text" />
    </v-responsive>
    <div class="flex-grow px-2 bdrd-2 lh-1">
      <div class="fw-bold grey100--text body-2 lh-1 my-1 disp-flex flex-center-y">
        USER TIP
      </div>
      <div class="message body-2 grey100--text">
        <span class="link fw-bold info--text" @click="$userMenu.open($event, from)">{{ from.username }}</span> sent {{ message.items.length }} item(s) to
        <span class="link fw-bold info--text" @click="$userMenu.open($event, to)">{{ to.username }}</span> worth

        <span class="no-wrap">
          <fai class="gold--text ml-1" :icon="['fas','coins']" />
          {{ total | currencyInt }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatTip',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    to() {
      return this.message.to
    },
    from() {
      return this.message.from
    },
    total() {
      return this.message.items.reduce((acc, v) => acc + v.price, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  line-height: 1.4 !important;
}
</style>
