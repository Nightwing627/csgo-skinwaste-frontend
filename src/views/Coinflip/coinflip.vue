<template>
  <v-container fluid class="py-0 full-height">
    <link rel="preload" as="image" href="@/assets/img/ct-sprite.svg">
    <link rel="preload" as="image" href="@/assets/img/t-sprite.svg">
    <v-row>
      <v-col class="disp-flex flex-center-y" cols="12">
        <v-btn
          color="grey500" class="mr-3 px-4 flex-shrink text-capitalize fw-regular grey100--text"
          :ripple="false" elevation="0" large @click="$modal.open('coinflipHistory', {maxWidth: 700})"
        >
          <fai :icon="['fas', 'history']" class="mr-2" /> History
        </v-btn>

        <v-btn
          color="primary"
          class=" flex-shrink px-6 fw-regular text-capitalize" :ripple="false"
          elevation="0"
          large @click="$modal.open('coinflipCreate', {maxWidth: 900})"
        >
          <fai :icon="['far', 'plus']" class="mr-2" /> Create Game
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="3" md="6" cols="12" class="pb-0">
        <v-sheet color="grey500" class="bdrd-2 py-3 px-2 disp-flex flex-center-y flex-between-x">
          <div class="primary300--text fw-regular px-3 subtitle-2">
            <fai :icon="['fas', 'gamepad']" class="primary--text" /><span class="ml-2 text--text">Total Games</span>
          </div>
          <div class="primary300--text fw-regular px-3 subtitle-2">
            {{ tickers.count | intToLocale }}
          </div>
        </v-sheet>
      </v-col>
      <v-col lg="3" md="6" cols="12" class="pb-0">
        <v-sheet color="grey500" class="bdrd-2 py-3 px-2 disp-flex flex-center-y flex-between-x">
          <div class="primary300--text fw-regular px-3 subtitle-2">
            <fai :icon="['far', 'dollar-sign']" class="primary--text" /><span class="ml-2 text--text">Total Value</span>
          </div>
          <div class="primary300--text fw-regular px-3 subtitle-2">
            {{ tickers.value | currencyInt }}
          </div>
        </v-sheet>
      </v-col>
      <v-col lg="3" md="6" cols="12" class="pb-0">
        <v-sheet color="grey500" class="bdrd-2 pa-3 disp-flex flex-center-y flex-between-x">
          <div class="primary300--text fw-regular px-3 subtitle-2">
            <fai :icon="['fas', 'book-spells']" class="primary--text" /><span class="ml-2 text--text">Total Joinable</span>
          </div>
          <div class="primary300--text fw-regular px-3 subtitle-2">
            {{ tickers.joinable | intToLocale }}
          </div>
        </v-sheet>
      </v-col>
      <v-col lg="3" md="6" cols="12" class="pb-0">
        <v-sheet color="grey500" class="bdrd-2 pa-3 disp-flex flex-center-y flex-between-x">
          <div class="primary300--text fw-regular px-3 subtitle-2">
            <fai :icon="['fas', 'sack-dollar']" class="primary--text" /><span class="ml-2 text--text">My Total Value</span>
          </div>
          <div class="primary300--text fw-regular px-3 subtitle-2">
            {{ tickers.ownTotal | currencyInt }}
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-between-x flex-center-y my-2">
          <h3 class="title ">
            Coinflip Lobbies
          </h3>
          <v-switch
            v-model="hideCompleted" color="grey100" hide-details dense
            label="Hide completed" class="ma-0"
          />
        </div>
        <transition-group class="games-ctn" name="v-scale">
          <div
            v-for="game in sortedGames" :key="game.id" class="game mb-2" :class="{
              own: game.own,
              lastOwned: lastOwnedId === game.id // hyperdansgamew kekw
            }"
          >
            <div class="players-ctn">
              <div class="disp-flex flex-center">
                <!-- t player -->
                <div class="avatar-ctn">
                  <v-tooltip v-if="game.t" color="primary" bottom nudge-bottom="-5">
                    <template v-slot:activator="{on}">
                      <v-img
                        width="100%" max-width="40" :aspect-ratio="1" contain
                        class="bdrd-circle side--t flex-no-grow link"
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
                        :aspect-ratio="1" contain class="bdrd-circle link flex-no-grow"
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
                    class="coin bdrd-circle"
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
                        class="bdrd-circle side--ct flex-no-grow link"
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
                        :aspect-ratio="1" contain class="bdrd-circle link flex-no-grow"
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
                    class="coin bdrd-circle"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./coinflip.js"></script>
<style lang="scss" scoped src="./coinflip.scss"></style>
