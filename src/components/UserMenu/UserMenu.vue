<template>
  <v-menu
    v-model="show"
    :close-on-content-click="false"
    absolute
    :close-delay="0"
    :nudge-width="250"
    :position-x="x"
    :position-y="y"
  >
    <v-card v-if="iUser" color="grey500">
      <v-list dense color="grey500" class="py-1">
        <v-list-item>
          <v-list-item-avatar class="bdrd-1">
            <img :src="iUser.avatar">
          </v-list-item-avatar>

          <v-list-item-content>
            <div
              class="fw-semibold body-2 grey100--text lh-1 mb-1 disp-iflex flex-center-y link user-menu"
            >
              <div
                v-if="iUser.rank === 2"
                class="leading-none bg-mod mr-1 badge"
              >
                MOD
              </div>
              <div
                v-if="iUser.rank === 3"
                class="leading-none bg-admin mr-1 badge"
              >
                ADMIN
              </div>
              <div
                class="text-truncate leading-none"
                :class="{
                  vip: iUser.rank == 1,
                  mod: iUser.rank == 2,
                  admin: iUser.rank == 3,
                  bot: iUser.rank == 4 ,
                  gld: iUser.rank == 0 && inRange(iUser.level, 80, 99),
                  dia: iUser.rank == 0 && iUser.level >= 100
                }"
              >
                <span
                  v-if="iUser.rank == 0"
                  class="levels"
                  :class="{
                    lvl10: inRange(iUser.level, 0, 10),
                    lvl29: inRange(iUser.level, 11, 29),
                    lvl49: inRange(iUser.level, 30, 49),
                    lvl79: inRange(iUser.level, 50, 79),
                    lvl99: inRange(iUser.level, 80, 99),
                    lvl100: iUser.level >= 100
                  }"
                >
                  {{ iUser.level }}</span>
                {{ iUser.username }}
                <span v-if="iUser.rank == 0 &&iUser.level >= 100" class="diamond" />
              </div>
            </div>
            <fai
              v-if="iUser.rank === 1"
              :icon="['fas', 'badge-check']"
              title="Verified User"
              class="ml-1 subtitle-1 info--text"
            />
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list dense color="grey700">
        <!-- steam profile -->
        <v-list-item :ripple="false" @click="steamProfile(iUser.steamid)">
          <v-list-item-action class="disp-flex mr-3 flex-center">
            <fai
              :icon="['fab', 'steam-symbol']"
              fixed-width
              class="icon title primary--text"
            />
          </v-list-item-action>
          <v-list-item-title>Open Steam Profile</v-list-item-title>
        </v-list-item>

        <!-- send tip -->
        <v-list-item
          v-if="user ? user._id !== iUser.id : true"
          :ripple="false"
          @click="$modal.open('tip', { maxWidth: 900 }, { toUser: iUser })"
        >
          <v-list-item-action class="disp-flex mr-3 flex-center">
            <fai
              :icon="['fas', 'coins']"
              fixed-width
              class="icon title primary--text"
            />
          </v-list-item-action>
          <v-list-item-title>Send Tip</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- MOD MENU -->
      <v-divider v-if="user.rank > 1" />

      <v-list v-if="user.rank > 1" dense color="grey700">
        <!-- quick actions -->
        <v-list-item
          v-if="user.rank > 1 && origin === 'chat'"
          class="mt-n2 py-3 d-flex flex-center-y grey900 flex-between-x"
        >
          <v-tooltip color="primary" bottom nudge-bottom="-5">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="grey300 primary--text"
                v-on="on"
                @click="
                  sendChat({
                    message: `/mute ${iUser.id} min 5`,
                    room: currentRoom
                  })
                "
              >
                <fal fixed-width class="subtitle-1">
                  <fai icon="history" />
                  <fai
                    icon="circle"
                    class="grey300--text"
                    transform="shrink-3 right-6 up-6"
                  />
                  <fat
                    class="primary--text fw-black"
                    transform="up-6 right-6 shrink-7"
                    value="5"
                  />
                </fal>
              </v-btn>
            </template>
            <span>Mute 5m</span>
          </v-tooltip>
          <v-tooltip color="primary" bottom nudge-bottom="-5">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="grey300 primary--text"
                v-on="on"
                @click="
                  sendChat({
                    message: `/mute ${iUser.id} min 15`,
                    room: currentRoom
                  })
                "
              >
                <fal fixed-width class="subtitle-1">
                  <fai icon="history" />
                  <fai
                    icon="circle"
                    class="grey300--text"
                    transform="shrink-3 right-6 up-6"
                  />
                  <fat
                    class="primary--text fw-black"
                    transform="up-6 right-6 shrink-9"
                    value="15"
                  />
                </fal>
              </v-btn>
            </template>
            <span>Mute 15m</span>
          </v-tooltip>
          <v-tooltip color="primary" bottom nudge-bottom="-5">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="grey300 primary--text subtitle-1"
                v-on="on"
                @click="
                  sendChat({ message: `/purge ${iUser.id}`, room: currentRoom })
                "
              >
                <fai icon="eraser" />
              </v-btn>
            </template>
            <span>Purge</span>
          </v-tooltip>
          <v-tooltip color="primary" bottom nudge-bottom="-5">
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="grey300 subtitle-1 primary--text fw-bold"
                v-on="on"
                @click="
                  sendChat({
                    message: 'im gay :rainbow_flag:',
                    room: currentRoom
                  })
                "
              >
                :)
              </v-btn>
            </template>
            <span>Come out</span>
          </v-tooltip>
        </v-list-item>

        <!-- Copy ID -->
        <v-list-item :ripple="false" @click="copy(iUser.id)">
          <v-list-item-action class="disp-flex mr-3 flex-center">
            <fai
              :icon="['fas', 'id-badge']"
              fixed-width
              class="icon title primary--text"
            />
          </v-list-item-action>
          <v-list-item-title>Copy Support ID</v-list-item-title>
        </v-list-item>

        <!-- ADMINS ONLY -->
        <!-- inspect -->
        <v-list-item
          v-if="user.rank > 2"
          :ripple="false"
          @click="$modal.open('admin', { maxWidth: 900 }, { userid: iUser.id })"
        >
          <v-list-item-action class="disp-flex mr-3 flex-center">
            <fai
              :icon="['fas', 'user']"
              fixed-width
              class="icon title primary--text"
            />
          </v-list-item-action>
          <v-list-item-title>Inspect in Admin Panel</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import UserLevel from '@/components/UserLevel.vue'

export default {
  name: 'CompUserMenu',
  components: {
    UserLevel
  },
  data() {
    return {
      show: false,
      x: 0,
      y: 0,
      iUser: undefined,
      origin: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      currentRoom: 'chat/currentRoom'
    })
  },
  created() {
    this.$on('inspect', async ({ e, user, origin = null }) => {
      e.preventDefault()

      this.show = false
      this.iUser = user
      this.x = e.clientX
      this.y = e.clientY
      this.origin = origin

      await this.$nextTick()
      this.show = true

      // HACK
      setTimeout(() => {
        this.show = true
      }, 300)
    })
  },
  methods: {
    ...mapMutations({
      setChatInput: 'chat/setInput'
    }),
    ...mapActions({
      sendChat: 'chat/send'
    }),
    async copy(id) {
      if (!navigator.clipboard) {
        this.$toast.open({
          type: 'error',
          text: "Your browser doesn't support this feature."
        })
        return
      }

      try {
        await navigator.clipboard.writeText(id)

        this.$toast.open({ type: 'info', text: 'User ID copied.' })
      } catch (err) {
        console.error('Failed to copy!', err)
        this.$toast.open({ type: 'error', text: "Couldn't copy, sorry." })
      }
    },
    steamProfile(steamid) {
      const url = `https://steamcommunity.com/profiles/${steamid}`
      const win = window.open(url, '_blank')
      win.focus()
    },

    inRange(value, min, max) {
      return value >= min && value <= max
    }
  }
}
</script>

<style lang="scss" scoped>
.user-menu {
  .leading-none {
    line-height: 1.35em;
    height: 1.35em;
    font-size: 1.05em;
  }

  .levels,
  .badge {
    display: block;
    float: left;
    clear: left;
    margin-right: 0.4em;
    padding: 0 0.1em;
    min-width: 2.5em;
    height: 100%;
    border-radius: 0.25em;
    text-align: center;
    color: #fff;
    font-size: 0.9em;
  }
  .badge {
    margin-left: 0;
  }
  .badge.bg-admin {
    min-width: 4.25em;
  }

  .lvl10 {
    background: linear-gradient(90deg, #424b5a 0%, #363f4e 100%);
    border: 2px solid inherit;
  }
  .lvl29 {
    background: linear-gradient(90deg, #8796c1 0%, #90a1cf 100%);
    border: 2px solid #8796c1;
    line-height: 1.25em;
  }
  .lvl49 {
    background: linear-gradient(90deg, #7eceac 0%, #7fd2a5 100%);
    border: 2px solid #7eceac;
    line-height: 1.25em;
  }
  .lvl79 {
    background: linear-gradient(90deg, #ed886c 0%, #cd7762 100%);
    border: 2px solid #ed886c;
    line-height: 1.25em;
  }
  .lvl99 {
    background: linear-gradient(90deg, #ffc30c 0%, #ffac0c 100%);
    border: 2px solid #ffc30c;
    box-shadow: 0px 0px 20px rgba(255, 186, 12, 0.2);
    line-height: 1.25em;
  }
  .lvl100 {
    background: linear-gradient(90deg, #70d1f4 0%, #5cc0e4 100%);
    border: 2px solid #70d1f4;
    box-shadow: 0px 0px 20px rgba(112, 209, 244, 0.2);
    line-height: 1.25em;
  }
  .diamond {
    float: right;
    margin-left: 0.5em;
    width: 1.35em;
    height: 1.35em;
    background: url("/img/icons/diamond.png") no-repeat center;
    background-size: 5em 5em;
  }
  .badge {
    margin-left: 0;
  }
  .badge.bg-admin {
    min-width: 4.25em;
  }
  .badge.bg-mod{
    min-width: 4em;
  }
  .vip {
    color: #ff69b4;
  }
  .mod {
    color: #1e90ff;

  }
  .bg-mod {
    color: #f8f8f8;
    background-color: #1e90ff;
  }
  .admin {
    color: #ff3232;
  }
  .bg-admin {
    color: #f8f8f8;
    background-color: #ff3232;
  }

  .gld {
    color: #ffc30c;
  }
  .dia {
    color: #70d1f4;
  }
}
</style>
