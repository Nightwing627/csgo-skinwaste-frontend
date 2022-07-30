<template>
  <v-card class="modal bdrd-3 ma-0">
    <v-card-title class="text--text mb-1 flex-center">
      <span v-if="$store.state.coinparty.active">Create Coin Party!</span>
      <span v-else>Contribute to Coin Party</span>
    </v-card-title>
    <v-card-text>
      <div>
        <div class="text-center fw-bold">
          How much do you want to contribute to the Coin Party?
        </div>
        <form @submit.prevent="">
          <v-row>
            <v-col class="ml-10" cols="2">
              <v-text-field
                label="Minimum"
                :value="`${parseFloat(minimum / 100).toFixed(2)}`"
                prefix="$"
                disabled
              />
            </v-col>
            <v-col cols="8">
              <v-text-field v-model="donation" label="Amount" prefix="$" />
            </v-col>
          </v-row>
        </form>
      </div>
    </v-card-text>
    <v-card-actions class="pa-4 grey700 flex-center-y flex-end-x">
      <v-btn text small @click="close">
        Close
      </v-btn>
      <v-btn text small @click="donate">
        Donate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { user as api } from "@/api";

export default {
  props: ["close", "options", "payload"],
  data() {
    return {
      donation: 5,
      minimum: 5
    };
  },
  computed: {
    ...mapGetters({
      config: "config",
      user: "user/getUser",
      inventory: "user/inventory"
    })
  },
  mounted() {
    this.minimum = this.config.coinparty.min;
    this.donation = parseFloat(this.minimum / 100).toFixed(2);
  },
  methods: {
    ...mapActions({
      createCoinparty: "coinparty/create"
    }),
    ...mapMutations({ setUser: "user/setUser" }),
    async donate() {
      if (this.donation < this.config.coinparty.min / 100) return
      await this.createCoinparty({ amount: this.donation });
      this.setUser(await api.get());
      this.close();
    },
    countDecimals(value) {
      if (value % 1 != 0) return value.toString().split(".")[1].length;
      return 0;
    }
  },  watch: {
        donation: function(val) {
      if (val < 0) this.donation = "0.00";
      if (this.countDecimals(val) > 2) {
        this.donation = parseFloat(val).toFixed(2);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.modal ::v-deep ul {
  margin-bottom: 20px;
}
</style>
