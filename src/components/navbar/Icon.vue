<template>
  <router-link v-if="name && isVisible" :to="to">
    <v-avatar :size="size" tile class="mr-5">
      <v-img :src="require(`@/assets/img/svg/${name}.svg`)" contain />
    </v-avatar>
  </router-link>
</template>

<script>
export default {
  name: 'NavbarIcon',
  props: {
    name: {
      type: String,
      default: ''
    },
    to: {
      type: [String, Object],
      default: ''
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 32
    }
  }
}
</script>

<style>

</style>
