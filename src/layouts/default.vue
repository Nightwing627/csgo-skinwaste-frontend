<template>
  <v-app class="appwrapper" :class="{ blurred: !focused }">
    <!-- connection alert -->
    <v-snackbar
      :value="reconnectionAttempts >= 2"
      top
      color="error"
      :timeout="0"
    >
      <fai class="mr-4" :icon="['fas', 'wifi-slash']" />
      <span>You have lost connection to the server. Retrying...</span>
      <v-progress-circular class="ml-6" indeterminate :width="2" :size="15" />
    </v-snackbar>

    <transition name="loaderAnim">
      <v-container
        v-if="active"
        fluid
        fill-height
        class="pa-0 problem-overlay grey900"
      >
        <v-layout v-if="config" row>
          <!-- Maintenance -->
          <v-flex
            v-if="config.site.maint && config.site.maint.enabled"
            xs12
            class="disp-flex flex-center"
          >
            <div class="reasonable text-center">
              <fai
                class="mb-4 display-3 error--text"
                :icon="['fas', 'user-hard-hat']"
              />
              <div class="title mb-2 error--text text-uppercase">
                Maintenance
              </div>
              <div>
                {{ config.site.maint.message }}
              </div>
              <v-btn
                v-if="!user"
                class="error--text"
                small
                text
                @click="
                  $modal.open('auth', { maxWidth: 300, persistent: true })
                "
              >
                Sign in
              </v-btn>
            </div>
          </v-flex>

          <!-- Whitelist -->
          <v-flex v-else-if="!isInWhitelist" xs12 class="disp-flex flex-center">
            <div class="reasonable text-center">
              <fai
                class="mb-4 display-3 error--text"
                :icon="['fas', 'user-shield']"
              />
              <div class="title mb-2 error--text text-uppercase">
                Whitelisted Access Only
              </div>
              <div class="mb-4">
                Only whitelisted users are currently allowed to access the
                website.
              </div>
              <v-btn
                v-if="!user"
                class="error--text"
                small
                text
                @click="
                  $modal.open('auth', { maxWidth: 300, persistent: true })
                "
              >
                Sign in
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </transition>

    <transition name="slide-fade">
      <v-navigation-drawer
        v-if="navSidebarOpen"
        v-model="navSidebarOpen"
        fixed
        bottom
        temporary
        color="grey500"
        class="mobile-nav"
        :class="{ hidden: $vuetify.breakpoint.lgAndUp }"
        style="top:inherit;bottom:64px;height:inherit;min-width:25%;"
      >
        <v-list nav dense>
          <v-list-item-group active-class="deep-purple--text text--accent-4">
            <v-tabs vertical height="320">
              <v-tab
                v-for="(item, i) in items"
                v-if="!(item.text == 'Rewards' && !user)"
                :key="i"
                :ripple="false"
                :to="item.to"
                class="d-flex justify-center align-center w-full m-auto"
              >
                <div class="d-flex justify-center game-name">
                  <div class="d-flex justify-center subtitle-1 fw-bold lh-1">
                    <fai
                      v-if="item.icon"
                      :icon="item.icon"
                      class="mr-2 subtitle-1 icon"
                    />
                    {{ item.text }}
                  </div>
                </div>
              </v-tab>
            </v-tabs>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </transition>

    <!-- chat -->
    <v-navigation-drawer
      v-model="chatOpen"
      app
      color="grey500"
      :width="chatWidth"
      clipped
      mobile-break-point="960"
    >
      <Sidebar />
    </v-navigation-drawer>

    <Interface
      v-if="!active && ready"
      @navSidebar="toggleSidebar"
      @chatOpen="toggleChat"
    >
      <router-view v-if="!loading" />
    </Interface>
    <!-- Start of LiveChat (www.livechatinc.com) code -->

    <div
      v-if="!$vuetify.breakpoint.mdAndDown"
      class="chat-open-close"
      :style="{
        left: 0,
        transform: !chatOpen
          ? 'translateX(0)'
          : `translateX(${parseInt(chatWidth)}px)`
      }"
    >
      <div
        class="d-flex pa-4 bdrd-tl-5 bdrd-bl-5 grey300"
        style="transform: rotateY(180deg);"
        @click="chatOpen = !chatOpen"
      >
        <fai fixed-width icon="comments" class="title primary--text" />
      </div>
    </div>

    <noscript>
      <a href="https://www.livechatinc.com/chat-with/13071522/" rel="nofollow"
      >Chat with us</a
      >, powered by
      <a
      href="https://www.livechatinc.com/?welcome"
      rel="noopener nofollow"
      target="_blank"
      >LiveChat</a
      >
    </noscript>
    <!-- End of LiveChat code -->
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Interface from '@/views/Interface'
import Sidebar from '@/components/Sidebar'

export default {
  name: 'AppWrapper',
  components: {
    Interface,
    Sidebar
  },
  data() {
    return {
      // ready: false,
      // loading: false
      navSidebarOpen: false,
      items: [
        {
          icon: ['fas', 'treasure-chest'],
          text: 'Jackpot',
          to: { name: 'jackpot-elite' }
        },
        {
          icon: ['fas', 'dharmachakra'],
          text: 'Roulette',
          to: { name: 'roulette' }
        },
        {
          icon: ['fad', 'coin'],
          text: 'Coinflip',
          to: { name: 'coinflip' }
        },
        {
          icon: ['fas', 'folder'],
          text: 'Inventory',
          to: { name: 'inventory' }
        },
        {
          icon: ['fas', 'gift'],
          text: 'Rewards',
          to: { name: 'affiliate' }
        },
        {
          icon: ['fas', 'crown'],
          text: 'Leaderboard',
          to: { name: 'leaderboard' }
        },
        {
          text: 'Provably Fair',
          to: { name: 'fairness' }
        },
        {
          text: 'FAQ',
          to: { name: 'faq' }
        },
        {
          text: 'Terms of Service',
          to: { name: 'terms' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      config: 'config',
      reconnectionAttempts: 'reconnectionAttempts',
      connected: 'connected',
      user: 'user/getUser',
      focused: 'windowFocused',
      ready: 'ready',
      loading: 'loading'
    }),
    active() {
      if (!this.config) return true

      if (this.config.site.maint && this.config.site.maint.enabled) {
        if (!this.user || this.user.rank < 2) return true
      }

      if (!this.isInWhitelist) return true

      return false
    },
    isInWhitelist() {
      if (!this.config) return false

      if (this.config.site.whitelist && this.config.site.whitelist.enabled) {
        if (this.user) {
          return Object.keys(this.config.site.whitelist.users).includes(
            this.user._id
          )
        }
        return false
      }
      return true
    },
    chatOpen: {
      get() {
        return this.$store.state.sidebar.open
      },
      set(val) {
        this.setSidebar(val)
      }
    },
    chatWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '500'
        case 'sm':
          return '400'
        case 'md':
          return '280'
        case 'lg':
          return '300'
        case 'xl':
          return '340'
        default:
          return '330'
      }
    }
  },
  watch: {
    navSidebarOpen(val) {
      this.setNavSidebar(Boolean(val))
    }
  },
  async created() {
    if (this.$vuetify.breakpoint.xs) this.setNavSidebar(false)
    if (this.$vuetify.breakpoint.smAndDown) this.setSidebar(false)
    // this file is getting too long
    this.$modal.assign(this)

    // update windowFocus in store
    document.addEventListener(
      'visibilitychange',
      () => {
        this.setWindowFocus(document.visibilityState === 'visible')
      },
      true
    )

    // router
    this.$router.afterEach(() => {
      this.$vuetify.goTo(0)
    })

    // TODO: where do i put this tbh
    if (this.$route.query.ref) {
      this.$modal.open(
        'refConfirm',
        { maxWidth: 400 },
        { code: this.$route.query.ref }
      )
    }
  },
  mounted() {
    this.addCrispComponent()
  },
  methods: {
    ...mapMutations(['setWindowFocus', 'setSidebar', 'setNavSidebar']),
    refresh() {
      window.location.reload()
    },
    addCrispComponent() {
      window.$crisp = []
      window.CRISP_WEBSITE_ID = '6c1251b6-a40d-4469-a75a-2ad2228340d2';
      (function anonymous() {
        const d = document
        const s = d.createElement('script')
        s.src = 'https://client.crisp.chat/l.js'
        s.async = 1
        d.getElementsByTagName('head')[0].appendChild(s)
      }())
    },
    toggleSidebar() {
      this.navSidebarOpen = !this.navSidebarOpen
    },
    toggleChat() {
      this.chatOpen = !this.chatOpen
    }
  }
}
</script>
<style lang="scss">
#crisp-chatbox {
  a {
    bottom: 3.2rem !important;
  }
}
</style>

<style lang="scss" scoped>
.appwrapper {
  overflow: hidden;
  color: $text;
}

.reasonable {
  max-width: 500px;
}

.problem-overlay {
  overflow: hidden;
  position: fixed;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  transition: transform 1s cubic-bezier(0.9, 0, 0, 0.9);
}

.loaderAnim-leave,
.loaderAnim-enter-to {
  transform: translateY(0);
}

.loaderAnim-leave-to,
.loaderAnim-enter {
  transform: translateY(100%);
}

.mobile-nav {
  // transition: 2.5s;
  // transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  .v-tabs {
    margin-left: 0 !important;
    background: transparent !important;
  }

  .v-tabs ::v-deep .v-slide-group {
    background: transparent !important;
  }

  .v-tabs ::v-deep .v-slide-group__wrapper {
    overflow: visible;
    contain: unset;
  }

  .w-full {
    width: 100% !important;
  }

  .v-tab {
    overflow: visible;
    width: 20%;
    min-width: 150px;
    border-bottom: 1px solid $grey300;
    opacity: 1 !important;
    background: transparent !important;
    text-transform: unset !important;
    transition: background 0.3s ease;
    transform: translate(0, 1px);

    .game-name {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .subtitle-1 {
        color: $grey100;
      }
    }

    &.v-tab--active {
      position: relative;
      transform: translate(0, -1px);
      border: 1px solid $primary;
      border-radius: 0 3px 3px 0;
      .game-name {
        .subtitle-1 {
          color: $text;

          .icon {
            color: $primary;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 1441px) {
    .v-tab {
      // min-width: 300px;
      padding: 0 12px !important;

      .game-name {
        .title {
          margin-bottom: 0 !important;
          font-size: 16px !important;
        }

        .body-1 {
          font-size: 12px !important;
        }
      }

      .game-time {
        svg {
          font-size: 16px !important;
        }
      }

      .game-value .primary {
        padding: 4px 8px !important;
        font-size: 12px !important;
      }
    }
  }

  @media only screen and (max-width: 1150px) {
    .v-tab {
      padding: 0 12px !important;

      .game-name {
        position: relative;
        top: unset;
        left: unset;
        text-align: left !important;
        transform: unset;
      }

      > .game-time,
      > .spacer {
        display: none;
      }

      .game-value .primary {
        padding: 4px 8px !important;
        font-size: 12px !important;
      }
    }
  }

  @media only screen and (max-width: 599px) {
    .v-tabs {
      &::v-deep {
        .v-slide-group__prev {
          display: none !important;
        }

        .v-slide-group__wrapper {
          overflow: hidden;
          contain: inherit;
        }
      }
    }

    .v-tab .arrow {
      display: none;
    }
  }
}

.chat-open-close {
  position: fixed;
  top: 86vh;
  z-index: 5;
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  -webkit-transition-property: width, -webkit-transform;
  transition-property: width, -webkit-transform;
  transition-property: transform, width;
  transition-property: transform, width, -webkit-transform;
}
</style>
