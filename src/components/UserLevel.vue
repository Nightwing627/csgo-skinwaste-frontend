<template>
  <span v-if="user.rank == 0" class="user-level" :class="{large, opaque}">
    <div class="lh-1 disp-flex flex-center-y leading-none">
      <span v-show="large">Level</span>
      <div
          v-if="user.rank === 2"
          class="leading-none bg-mod mr-1 badge"
        >
          MOD
        </div>
        <div
          v-if="user.rank === 3"
          class="leading-none bg-admin mr-1 badge"
        >
          ADMIN
        </div>
        <div
          class="text-truncate leading-none"
          :class="{
            vip: user.rank == 1,
            mod: user.rank == 2,
            admin: user.rank == 3,
            bot: user.rank == 4 ,
            gld: user.rank == 0 && inRange(user.level, 80, 99),
            dia: user.rank == 0 && user.level >= 100
          }"
        >
          <span
            v-if="user.rank == 0"
            class="levels"
            :class="{
              lvl10: inRange(user.level, 0, 10),
              lvl29: inRange(user.level, 11, 29),
              lvl49: inRange(user.level, 30, 49),
              lvl79: inRange(user.level, 50, 79),
              lvl99: inRange(user.level, 80, 99),
              lvl100: user.level >= 100
            }"
          >
            {{ user.level }}</span>
          <span v-if="user.rank == 0 && user.level >= 100" class="diamond" />
        </div>
        <fai
          v-if="user.rank === 1"
          :icon="['fas', 'badge-check']"
          class="ml-1 subtitle-1 info--text"
        />
    </div>
  </span>
</template>

<script>
import { LEVEL_COLORS } from '../utils/constants'

export default {
  name: 'VolumeControl',
  props: ['user', 'large', 'opaque'],
  computed: {
    color() {
      const maxLevel = Object.keys(LEVEL_COLORS)[Object.keys(LEVEL_COLORS).length - 1]
      const dizaine = Math.floor(this.user.level / 20) * 20

      if (dizaine > maxLevel) return maxLevel
      return LEVEL_COLORS[dizaine]
    }
  },
  methods: {
    inRange(value, min, max) {
      return value >= min && value <= max
    }
  }
}
</script>

<style lang="scss" scoped>
.user-level {
  display: inline-block;
  position: relative;
  margin: auto;
  border: 1px solid var(--color);
  border-radius: 4px;
  color: $grey100;
  font-weight: bold !important;
  text-align: center;
  white-space: nowrap;

  > div {
    position: relative;
    z-index: 2;
  }

  &.opaque {
    &::before {
      opacity: 1;
    }
  }

  &::before {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: var(--color);
    content: ' ';
  }

  .leading-none {
    line-height: 1.35em;
    height: 1.35em;
    font-size: 1em;
    font-weight: 400;
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
}
</style>
