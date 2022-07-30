<template>
  <v-card class="modal grey900 ma-0">
    <v-card-title
      class="d-block d-sm-flex text--text flex-between-x px-3 flex-center-y"
    >
      <div class="d-flex d-sm-block mb-1 mb-sm-0 flex-center-y flex-between-x">
        <h2 class="fw-bold title font2">
          Input your trade url
        </h2>
        <div class="disp-flex body-2 fw-bold grey100--text flex-center-y">
          Please enter your Steam Trade URL
        </div>
      </div>
    </v-card-title>

    <v-card-text class="px-3 pt-3 pb-0 text-center">
      <div v-if="user" class="mb-8">
        <v-text-field
          label="Your Trade URL"
          hint="https://steamcommunity.com/tradeoffer/new/..."
          persistent-hint
          outlined
          v-model="tradeURL"
        ></v-text-field>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 grey700 flex-center-y flex-between-x">
      <div class="grey100--text lh-1-2">
        <v-btn
          small
          text
          :link="true"
          target="_blank"
          href="http://steamcommunity.com/my/tradeoffers/privacy"
          :ripple="false"
          class="px-2 fw-bold mr-2"
        >
          Find your link
        </v-btn>
      </div>
      <div class="btns">
        <v-btn
          small
          text
          :ripple="false"
          class="px-2 fw-bold mr-2"
          @click="close"
        >
          Close
        </v-btn>
        <v-btn
          small
          text
          :ripple="false"
          class="success--text px-2 fw-bold mr-2"
          @click="saveAndContinue"
        >
          Continue
        </v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

import { user as api, rustysell } from "@/api";

import Inventory from "@/components/Inventory";
import { errorToast } from "@/utils";
import Errors from "@/utils/errors";

function CustomError(message) {
  this.name = "CustomError";
  this.message = message || "";
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
  this.code = Errors.InvalidTradeUrl;
}
CustomError.prototype = Object.create(Error.prototype);

export default {
  needsAuth: true,
  name: "ModalTip",
  components: {
    Inventory
  },
  metaInfo: {
    title: "Rust"
  },
  props: ["close", "options", "payload"],
  data() {
    return {
      tradeURL: ""
    };
  },
  computed: {
    ...mapGetters({
      config: "config",
      user: "user/getUser"
    })
  },
  mounted() {
    this.tradeURL = this.user.steamTrade.url || "";
  },
  methods: {
    ...mapActions({
      getInventory: "user/getInventory"
    }),
    async saveAndContinue() {
      try {
        if (
          this.tradeURL.length < 1 ||
          !this.tradeURL.startsWith("https://steamcommunity.com/tradeoffer/")
        ) {
          errorToast(new CustomError("Invalid Trade URL"));
          return;
        }
        await api.setTradeUrl(this.tradeURL);
        const url = (await rustysell.getURL()).depositUrl;
        window.open(url, "_blank").focus();
        this.close();
      } catch (err) {
        errorToast(err);
        return;
      }
    }
  }
};
</script>
