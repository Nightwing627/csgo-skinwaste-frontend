<template>
  <div class="d-flex justify-space-around align-center mr-10">
    <NavbarIcon
      v-for="item in items"
      :key="item.id"
      :name="item.name"
      :to="item.to"
      :size="item.size"
      :is-visible="item.isVisible"
    />
  </div>
</template>

<script>
import NavbarIcon from './Icon.vue'

export default {
  name: 'NavbarIcons',
  components: {
    NavbarIcon
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>

</style>
