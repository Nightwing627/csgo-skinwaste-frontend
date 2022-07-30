<template>
  <v-col md="6" offset-md="3">
    <v-progress-linear
      reverse
      rounded
      :value="timer"
      :height="6"
      :style="{
        transition: `${timer !== 100 ? '1s' : '9.25s'} linear !important`
      }"
    />
  </v-col>
</template>

<script>
export default {
  name: "JackpotTimer",
  props: {
    value: {
      type: Number,
      default: 100
    }
  },
  computed: {
    timer() {
      return this.value - 4 >= 0 ? this.value - 4 : 100;
    }
  }
};
</script>