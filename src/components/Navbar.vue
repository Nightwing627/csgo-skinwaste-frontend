<template>
  <v-tabs
    optional
    hide-slider
    center-active
    height="70"
  >
    <v-tab
      v-for="(item, i) in items"
      :key="i"
      :ripple="false"
      :to="item.to"
      class="d-flex justify-space-between align-center"
    >
      <div class="d-flex justify-center game-name">
        <div class="d-flex justify-center subtitle-1 fw-bold lh-1">
          <fai :icon="item.icon" class="mr-2 subtitle-1 icon" />
          {{ item.text }}
        </div>
      </div>
    </v-tab>

    <v-spacer />

    <NavbarIcons :items="icons" />
  </v-tabs>
</template>

<script>
import NavbarIcons from '@/components/navbar/Icons.vue'

export default {
  name: 'Navbar',
  components: {
    NavbarIcons
  },
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      test: false,
      items: [
        {
          icon: ['fas', 'treasure-chest'],
          text: 'Jackpot',
          to: { name: 'jackpot-elite' }
        }, {
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
        }
      ]
    }
  },
  computed: {
    icons() {
      return [
        {
          id: 2, name: 'giftbox', to: { name: 'affiliate' }, size: 30, isVisible: this.isAuthenticated
        },
        {
          id: 1, name: 'crown', to: { name: 'leaderboard' }, size: 38, isVisible: true
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
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
    border-bottom: 1px solid $primary;

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
</style>
