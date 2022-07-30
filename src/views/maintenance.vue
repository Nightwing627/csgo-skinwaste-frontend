<template>
  <div class="content">
    <h2>
      {{ message }}
    </h2>
    <img src="../assets/img/bot.png" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MaintenancePage",
  data() {
    return {
      message: "Maintenace"
    };
  },
  computed: {
    ...mapGetters(["config"])
  },
  mounted() {

      this.message = this.config.site.maint.message
  },
  watch: {
    config: {
      handler() {
        this.message = this.config.site.maint.message;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin: 3rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;

}

</style>
