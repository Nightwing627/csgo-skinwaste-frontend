<template>
  <v-row class="mb-6 pa-3">
    <v-col cols="12">
      <v-card flat color="grey700" class="pa-3 bdrd-3" style="border: 2px solid #ec4a4b !important;">
        <h2 class="title mb-2 bdrd-2 d-inline-block fw-bold text-uppercase primary bdrd-0 grey900--text px-8 py-2">
          💥 Nuke Center
        </h2>
        <p class="body-2 fw-semibold">
          Change what you want and press confirm for changes to take effect.
        </p>
        <v-row>
          <v-col cols="12">
            <label class="mb-1 text-uppercase fw-semibold primary--text d-block">Betting</label>
            <div class="d-flex flex-center-y">
              <v-btn
                :class="{active: enabled.elite}" color="grey500" depressed
                x-large class="styled-toggle body-2 px-4 fw-bold bdrd-tr-0 bdrd-br-0" @click="enabled.elite = !enabled.elite"
              >
                <fai fixed-width :icon="enabled.elite ? 'check' : 'times'" class="mr-2" />
                Elite
              </v-btn>
              <v-btn
                :class="{active: enabled.silver}" color="grey500" depressed
                x-large class="styled-toggle body-2 px-4 fw-bold bdrd-0" @click="enabled.silver = !enabled.silver"
              >
                <fai fixed-width :icon="enabled.silver ? 'check' : 'times'" class="mr-2" />
                Silver
              </v-btn>
              <v-btn
                :class="{active: enabled.coinflip}" color="grey500" depressed
                x-large class="styled-toggle body-2 px-4 fw-bold bdrd-0" @click="enabled.coinflip = !enabled.coinflip"
              >
                <fai fixed-width :icon="enabled.coinflip ? 'check' : 'times'" class="mr-2" />
                Coinflip
              </v-btn>
              <v-btn
                :class="{active: enabled.catcher}" color="grey500" depressed
                x-large class="styled-toggle body-2 px-4 fw-bold bdrd-tl-0 bdrd-bl-0" @click="enabled.catcher = !enabled.catcher"
              >
                <fai fixed-width :icon="enabled.catcher ? 'check' : 'times'" class="mr-2" />
                Catcher
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="mb-1 text-uppercase fw-semibold primary--text d-block">Crypto</label>
            <div class="d-flex flex-center-y">
              <v-btn
                :class="{active: enabled.deposit}" color="grey500" depressed
                large class="styled-toggle body-2 px-4 fw-bold mr-2" @click="enabled.deposit = !enabled.deposit"
              >
                <fai fixed-width :icon="enabled.deposit ? 'check' : 'times'" class="mr-2" />
                Deposits
              </v-btn>

              <v-btn
                :class="{active: enabled.withdraw}" color="grey500" depressed
                large class="styled-toggle body-2 px-4 fw-bold" @click="enabled.withdraw = !enabled.withdraw"
              >
                <fai fixed-width :icon="enabled.withdraw ? 'check' : 'times'" class="mr-2" />
                Withdraws
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="mb-1 text-uppercase fw-semibold primary--text d-block">CS:GO Withdraws</label>
            <div class="d-flex flex-center-y">
              <v-btn
                :class="{active: enabled.csgo}" color="grey500" depressed
                large class="styled-toggle body-2 px-4 fw-bold mr-2" @click="enabled.csgo = !enabled.csgo"
              >
                <fai fixed-width :icon="enabled.csgo ? 'check' : 'times'" class="mr-2" />
                {{ enabled.csgo ? 'Enabled' : 'Disabled' }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="mb-1 text-uppercase fw-semibold primary--text d-block">Chat</label>
            <div class="d-flex flex-center-y">
              <v-btn
                :class="{active: enabled.chat}" color="grey500" depressed
                large class="styled-toggle body-2 px-4 fw-bold mr-2" @click="enabled.chat = !enabled.chat"
              >
                <fai fixed-width :icon="enabled.chat ? 'check' : 'times'" class="mr-2" />
                {{ enabled.chat ? 'Enabled' : 'Disabled' }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" class="d-flex flex-end-x mt-4 px-6">
            <v-btn
              :disabled="!changed"
              :loading="loading.nuke"
              color="info" depressed
              x-large class="px-10 body-1 fw-bold" @click="updateNuke"
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- maintenance -->
    <v-col cols="6">
      <v-card flat color="grey700" class="px-3 bdrd-3">
        <v-row>
          <v-col cols="12">
            <label class="mb-3 title fw-semibold primary--text d-block">Maintenance</label>

            <v-btn
              :class="{active: maint.enabled}" color="grey500 mb-5" depressed
              x-large class="styled-toggle body-2 px-4 fw-bold" @click="maint.enabled = !maint.enabled"
            >
              <fai fixed-width :icon="maint.enabled ? 'check' : 'times'" class="mr-2" />
              {{ maint.enabled ? 'Enabled' : 'Disabled' }}
            </v-btn>

            <v-textarea
              v-model="maint.message" hide-details
              rows="3" label="Reason for maintenance"
              placeholder="Exitscam :Kapp" outlined
            />
          </v-col>

          <v-col cols="12" class="d-flex flex-end-x">
            <v-btn
              :loading="loading.maint"
              color="info" depressed
              class="px-10 body-1 fw-bold" @click="updateMaint"
            >
              Update
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-col cols="12" class="mt-12">
      <v-expansion-panels class="mb-5">
        <v-expansion-panel>
          <v-expansion-panel-header class="grey700 primary--text fw-semibold">
            Config
          </v-expansion-panel-header>
          <v-expansion-panel-content color="grey700">
            <pre>
{{ config }}
</pre>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { admin as api } from '@/api'
import { errorToast } from '@/utils'

export default {
  name: 'ModalAdminViewConfig',
  data() {
    return {
      loading: {
        nuke: false,
        maint: false
      },
      maint: {
        enabled: false,
        message: ''
      },
      enabled: {
        elite: true,
        silver: true,
        coinflip: true,
        catcher: true,
        deposit: true,
        withdraw: true,
        csgo: true,
        chat: true
      }
    }
  },
  created() {
    this.enabled = { ...this.config.site.enabled }
    this.maint = { ...this.config.site.maint }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      user: 'user/getUser'
    }),
    changed() {
      return JSON.stringify(this.config.site.enabled) !== JSON.stringify(this.enabled)
    }
  },
  methods: {
    async updateNuke() {
      if (this.loading.nuke) return
      this.loading.nuke = true

      try {
        await api.updateEnabled(this.enabled)
        this.$toast.open({ type: 'info', text: 'Updated, broadcasting...' })
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.nuke = false
      }
    },
    async updateMaint() {
      if (this.loading.maint) return
      this.loading.maint = true

      try {
        const message = this.maint.enabled ? this.maint.message : false
        await api.updateMaint(message)
        this.$toast.open({ type: 'info', text: 'Updated, broadcasting...' })
      } catch (e) {
        errorToast(e)
      } finally {
        this.loading.maint = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .styled-toggle {
  color: $primary;

  &::before {
    opacity: 0.2;
  }

  &.active {
    color: $secondary;
  }
}
</style>
