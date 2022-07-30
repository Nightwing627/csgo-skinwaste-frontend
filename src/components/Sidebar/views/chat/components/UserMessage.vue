<template>
  <div class="disp-flex flex-start-y mb-3">
    <v-img
      :src="message.user.rank !== 4 ? message.user.avatar: '/img/bot/avatar.png'"
      :width="30"
      :transition="false"
      :aspect-ratio="1"
      contain
      class="bdrd-circle ma-0 flex-no-grow link"
      @click="message.user.rank !== 4 ? $userMenu.open($event, message.user, 'chat') : ''"
    />
    <div class="flex-grow px-2 bdrd-2 lh-1 pos-relative message-content">
      <div
        class="fw-semibold body-2 grey100--text lh-1 mb-1 disp-iflex flex-center-y link"
        style="width: 100%;"
        @click="message.user.rank !== 4 ? $userMenu.open($event, message.user, 'chat'): ''"
      >
        <!-- @click="steamProfile(message.user.steamid)" -->
        <!-- v-if="message.user.rank > 1" -->
        <div
          v-if="message.user.rank === 2"
          class="leading-none bg-mod mr-1 badge"
        >
          MOD
        </div>
        <div
          v-if="message.user.rank === 3"
          class="leading-none bg-admin mr-1 badge"
        >
          ADMIN
        </div>
        <div
          class="text-truncate leading-none"
          :class="{
            vip: message.user.rank == 1,
            mod: message.user.rank == 2,
            admin: message.user.rank == 3,
            bot: message.user.rank == 4 ,
            gld: message.user.rank == 0 && inRange(message.user.level, 80, 99),
            dia: message.user.rank == 0 && message.user.level >= 100
          }"
        >
          <span
            v-if="message.user.rank == 0"
            class="levels"
            :class="{
              lvl10: inRange(message.user.level, 0, 10),
              lvl29: inRange(message.user.level, 11, 29),
              lvl49: inRange(message.user.level, 30, 49),
              lvl79: inRange(message.user.level, 50, 79),
              lvl99: inRange(message.user.level, 80, 99),
              lvl100: message.user.level >= 100
            }"
          >
            {{ message.user.level }}</span>
          {{ message.user.username }}
          <span v-if="message.user.rank == 0 && message.user.level >= 100" class="diamond" />
        </div>
        <fai
          v-if="message.user.rank === 1"
          :icon="['fas', 'badge-check']"
          class="ml-1 subtitle-1 info--text"
        />
        <div class="time">
          {{ time }}
        </div>
      </div>
      <div v-if="message.removed" class="faded-8 text-italic">
        message removed by moderator
      </div>
      <Message
        v-show="!message.removed"
        :data="message.message"
        class="message"
        :class="{
          vip: message.user.rank == 1,
          mod: message.user.rank == 2,
          admin: message.user.rank == 3,
          botMSG: message.user.rank == 4,
        }"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserLevel from '@/components/UserLevel.vue'
import Message from './message.vue'

export default {
  name: 'ChatUserMessage',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    UserLevel,
    Message
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['message'],
  data() {
    return {
      time: ''
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser'
    })
  },
  created() {
    this.getTime(this.message.createdAt)
    setTimeout(() => {
      this.getTime(this.message.createdAt)
    }, 60500)
  },
  methods: {
    inRange(value, min, max) {
      return value >= min && value <= max
    },
    getTime(time) {
      const date = new Date(time)
      if (date.getTime() > new Date().getTime() - 60000) {
        this.time = 'just now'
        return
      }
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const hoursWithZero = hours < 10 ? `0${hours}` : hours
      const minutesWithZero = minutes < 10 ? `0${minutes}` : minutes
      this.time = `${hoursWithZero}:${minutesWithZero}`
    }
  }
}
</script>

<style lang="scss">
.message-content {
  position: relative;
  line-height: 1.4em;
  font-size: 1.1em;
  margin-bottom: 0.3em;

  .time {
    position: absolute;
    margin-left: auto;
    right: 0;
    font-size: 0.9em;
    opacity: 0.7;
    margin-right: -0.9em;
    text-align: center;
  }

  .vip {
    color: #ff69b4;
  }
  .mod {
    color: #1e90ff;
  }
  .bot{
    color: #9c97ff ;
  }
  .bg-mod {
    color: #e0e0e0;
    background-color: #1e90ff;
  }
  .admin {
    color: #ff3232;
  }
  .bg-admin {
    color: #e0e0e0;
    background-color: #ff3232;
  }

  .gld {
    color: #ffc30c;
  }
  .dia {
    color: #70d1f4;
  }

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
  .badge.bg-mod{
    min-width: 4em;
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
  .botMSG {
    line-height: 1.5em;
    &span{
      margin-bottom: 1em;
    }
  }
}
</style>
