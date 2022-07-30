<template>
  <transition-group class="games-ctn" name="v-scale">
    <div
      v-for="game in games" :key="game.id" class="game mb-2" :class="{
        own: game.own,
        lastOwned: lastOwnedId === game.id // hyperdansgamew kekw
      }"
    >
      <!-- Players -->
      <div class="players-ctn">
        <div class="disp-flex flex-center">
          <!-- t player -->
          <div class="avatar-ctn">
            <v-tooltip v-if="game.t" color="primary" bottom nudge-bottom="-5">
              <template v-slot:activator="{on}">
                <v-img
                  width="100%" max-width="40" :aspect-ratio="1" contain
                  class="rounded-circle side--t flex-no-grow link"
                  :class="{'player-img-win': game.winner && game.winner.extra.side === 't'}"
                  :src="game.t.user.avatar"
                  @click="$userMenu.open($event, game.t.user)"
                  v-on="on"
                />
              </template>
              <span class="fw-bold">{{ game.t.user.username }}</span>
            </v-tooltip>
            <v-tooltip v-else color="primary" bottom nudge-bottom="-5">
              <template v-slot:activator="{on}">
                <v-img
                  width="100%" max-width="40"
                  :aspect-ratio="1" contain class="rounded-circle link flex-no-grow"
                  :src="require('@/assets/img/t-coin.svg')"
                  @click="!game.own ? $modal.open('coinflipJoin', {maxWidth: 900}, {coinflip: game.id}) : {}"
                  v-on="on"
                />
              </template>
              <span class="fw-bold">Join as T</span>
            </v-tooltip>
            <v-img
              v-if="game.t"
              width="100%" max-width="40" :aspect-ratio="1" contain
              class="coin rounded-circle"
              :class="`side--${game.t.extra.side}`"
              :src="require('@/assets/img/coinflip/t.png')"
            />
          </div>

          <span class="body-2 mx-2 grey100--text">vs</span>

          <!-- ct player -->
          <div class="avatar-ctn">
            <v-tooltip v-if="game.ct" color="info" bottom nudge-bottom="-5">
              <template v-slot:activator="{on}">
                <v-img
                  width="100%" max-width="40" :aspect-ratio="1" contain
                  class="rounded-circle side--ct flex-no-grow link"
                  :class="{'player-img-win': game.winner && game.winner.extra.side === 'ct'}"
                  :src="game.ct.user.avatar"
                  @click="$userMenu.open($event, game.ct.user)"
                  v-on="on"
                />
              </template>
              <span class="fw-bold">{{ game.ct.user.username }}</span>
            </v-tooltip>
            <v-tooltip v-else color="info" bottom nudge-bottom="-5">
              <template v-slot:activator="{on}">
                <v-img
                  width="100%" max-width="40"
                  :aspect-ratio="1" contain class="rounded-circle link flex-no-grow"
                  :src="require('@/assets/img/ct-coin.svg')"
                  @click="!game.own ? $modal.open('coinflipJoin', {maxWidth: 900}, {coinflip: game.id}) : {}"
                  v-on="on"
                />
              </template>
              <span class="fw-bold">Join as CT</span>
            </v-tooltip>
            <v-img
              v-if="game.ct"
              width="100%" max-width="40" :aspect-ratio="1" contain
              class="coin rounded-circle"
              :class="`side--${game.ct.extra.side}`"
              :src="require('@/assets/img/coinflip/ct.png')"
            />
          </div>
        </div>
      </div>

      <div class="items-ctn disp-flex flex-center-y">
        <Item
          v-for="(item, i) in game.items" v-show="i < 4" :key="item.backpackId"
          :class="{
            own: game.own,
          }"
          :data="item" class="ma-0"
        />
        <div v-if="game.items.length > 4" class="caption fw-semibold ml-3">
          + {{ game.items.length - 4 }} more
        </div>
      </div>

      <div class="total-ctn text-center">
        <div class="mb-1 subtitle-2">
          <fai :icon="['far', 'dollar-sign']" />
          {{ game.total | currencyInt }}
        </div>
        <div v-show="game.state === 0" class="caption lh-1 grey100--text">
          {{ game.range.low | currencyInt }} &ndash; {{ game.range.high | currencyInt }}
        </div>
      </div>

      <v-divider vertical />

      <div class="actions-ctn d-flex flex-center text-center px-2">
        <v-btn
          color="grey300" small
          depressed
          @click="$modal.open('coinflipView', {maxWidth: 700, noShadow: true}, {coinflip: game.id})"
        >
          <fai :icon="['fas', 'eye']" :class="{'mr-1': (game.state === 0 && game.own) || game.state >= 2}" /> {{ (game.state === 0 && game.own) || game.state >= 2 ? 'Watch' : '' }}
        </v-btn>
        <v-btn
          v-if="game.state === 0"
          v-show="game.state === 0 && !game.own"
          depressed
          class="mx-1" color="primary" small
          @click="$modal.open('coinflipJoin', {maxWidth: 900}, {coinflip: game.id})"
        >
          <img width="14" :src="require(`@/assets/img/${game.ct ? 't' : 'ct'}.svg`)" class="mr-1">
          Join
        </v-btn>
        <div v-else v-show="game.state === 1" class="timer ml-2">
          <v-img
            width="40" :aspect-ratio="1" contain
            :src="require('@/assets/img/cf_timer_border.svg')"
          />
          <span class="fw-bold">{{ Math.round((game.rollingAt - currentUnix) / 1000) }}</span>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import Item from '@/components/Item'

export default {
  name: 'CoinflipLobbies',
  components: {
    Item
  },
  props: {
    games: {
      type: Array,
      default: () => []
    },
    currentUnix: {
      type: Number,
      default: 0
    },
    lastOwnedId: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  display: flex;
  border: 2px solid rgba($grey100, 0.2) !important;
  border-radius: 4px;
  background: $grey700;
  transition: transform 0.3s ease, opacity 0.3s ease;
  align-items: center;

  .players-ctn {
    flex: 1 0 200px;

    .avatar-ctn {
      position: relative;
      width: 100%;
      max-width: 40px;

      .coin {
        position: absolute;

        &.side--ct {
          top: -15px;
          left: -15px;
        }

        &.side--t {
          top: -15px;
          right: -15px;
        }
      }
    }
  }

  .items-ctn {
    overflow: hidden;
    position: relative;
    margin: -1px 0 -1px 0;
    transform: scale(1px);
    flex: 4 0 300px;

    .item {
      min-width: 80px;
      max-width: 80px;
      min-height: 80px;
      max-height: 40px;
      border-top: none;
      border-right: none;
      border-bottom: none;
      border-left: none;
      background-color: $grey700;
      cursor: unset;

      &.own {
        background: darken($grey700, 3%);
      }

      &:last-child {
        border-right: 2px solid rgba($grey100, 0.2);
      }

      &::after {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 1px;
        height: 100%;
        background: /* gradient can be an image */
          linear-gradient(
            to bottom,
            rgba($grey100, 0.2),
            rgba($grey100, 0.2) 10%,
            #82827400 10%,
            #d7f0a200 20%,
            var(--color) 20%,
            var(--color) 80%,
            #82827400 80%,
            #d7f0a200 90%,
            rgba($grey100, 0.2) 90%,
            rgba($grey100, 0.2) 99%,
          )
          left
          bottom
          no-repeat;
        content: ' ';
      }

      ::v-deep {
        .itemattr-wear {
          display: none;
        }

        .itemattr-price {
          display: none;
        }

        .itemattr-name {
          display: none;
        }

        .meta {
          .item-info {
            font-size: 11px;
          }

          &:hover {
            opacity: 0;

            .item-info {
              opacity: 0;
              transform: translateY(0);
            }
          }
        }
      }
    }
  }

  .total-ctn {
    flex: 1 0 80px;

    .caption {
      opacity: 0.75;
      font-size: 11px !important;
    }
  }

  .status-ctn {
    flex: 1 0 100px;
  }

  .actions-ctn {
    flex: 1 0 100px;

    .timer {
      position: relative;

      span {
        position: absolute;
        top: 50%;
        left: 50%;
        color: $grey100;
        transform: translate(-50%, -50%);
      }
    }

    .v-btn {
      border: 1px solid $grey100 !important;
    }
  }

  .player-img-win {
    filter: drop-shadow(0 0 5px rgba(156, 151, 255, 0.35));

    &.side--t {
      border: 2px solid $whiteish;
    }

    &.side--ct {
      border: 2px solid #9c97ff;
    }
  }

  &.own {
    background: darken($grey700, 3%);
  }

  &.lastOwned {
    margin-bottom: 12px;
  }
}

@media only screen and (max-width: 1263px) {

  .game {
    .players-ctn {
      flex: 1 0 160px;

      .player-img,
      .coin {
        max-width: 56px !important;
      }
    }

    .items-ctn {
      flex: 4 0 150px;
      overflow-x: auto;
      position: relative;

      // &::after {
      //   position: absolute;
      //   top: 0;
      //   right: 0;
      //   width: 40px;
      //   height: 100%;
      //   background: linear-gradient(to left, $grey900, rgba($grey900, 0));
      //   content: ' ';
      // }

      .item {
        min-width: 90px;
        max-width: 90px;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .status-ctn {
      flex: 1 0 60px;

      .player-img {
        max-width: 56px !important;
      }
    }
  }
}

@media only screen and (max-width: 900px) {

  .game {
    .status-ctn {
      font-size: 12px;
      font-weight: bold;
    }

    .total-ctn {
      flex: 1 0 60px;
      font-size: 12px;
      font-weight: bold;
    }

    .items-ctn {
      flex: 4 0 120px;

      .item {
        min-width: 90px;
        max-width: 90px;
      }
    }

    .actions-ctn {
      .v-btn {
        width: 90%;
        margin: 0 0 8px !important;
      }
    }
  }
}

@media only screen and (max-width: 599px) {

  .game {
    margin-bottom: 12px;
    border-radius: 10px;
    // flex-direction: column;
    flex-wrap: wrap;

    .players-ctn {
      padding: 4px 24px;
      order: 1;
      flex: 1 0 150px;

      .player-img,
      .coin {
        max-width: 72px !important;
      }
    }

    .total-ctn {
      order: 2;
      flex: 1;
      font-size: 16px;
      font-weight: normal;
    }

    .status-ctn {
      order: 3;
      flex: 1;
      font-size: 16px;
      font-weight: normal;
    }

    .items-ctn {
      order: 4;
      flex: 1 0 100%;
      padding: 10px 12px;

      .item {
        min-width: 90px;
        max-width: 90px;
      }
    }

    .actions-ctn {
      margin: 10px 0;
      order: 5;

      .v-btn {
        width: 90%;
        margin: 0 0 8px !important;
      }
    }
  }
}
</style>
