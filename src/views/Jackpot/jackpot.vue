<template>
  <v-container v-if="!status" fluid class="loader-ctn py-0 full-height">
    <v-row>
      <v-col class="grey900 disp-flex flex-center-y" cols="12">
        <v-skeleton-loader type="image" min-width="120" max-height="50" class="mr-2" />
        <v-skeleton-loader type="image" min-width="120" max-height="50" class="mr-2" />
        <v-skeleton-loader type="image" min-width="120" max-height="50" class="mr-4" />
        <v-skeleton-loader type="button" class="mr-2" />
        <v-skeleton-loader type="button" class="mr-2" />
        <v-skeleton-loader type="button" />

        <v-spacer />
        <v-skeleton-loader type="sentences" min-width="120" />
      </v-col>

      <v-col class="disp-flex flex-center-y mb-4" cols="12">
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" class="mr-2" />
        <v-skeleton-loader type="image" max-height="150" min-width="8%" />
      </v-col>

      <v-col class="grey500 pa-0 disp-flex flex-center-y mb-4" cols="12">
        <v-skeleton-loader
          class="mr-1" type="image" tile max-height="150"
          width="19%"
        />
        <v-skeleton-loader
          class="mr-1" type="image" tile max-height="150"
          width="10%"
        />
        <v-skeleton-loader
          class="mr-1" type="image" tile max-height="150"
          width="3%"
        />
        <v-skeleton-loader
          class="mr-1" type="image" tile max-height="150"
          width="13%"
        />
        <v-skeleton-loader
          class="mr-1" type="image" tile max-height="150"
          width="11%"
        />
      </v-col>

      <v-col class="disp-flex flex-center-y mb-10" cols="12">
        <v-skeleton-loader type="list-item-avatar-three-line" min-width="300" class="mr-2" />
        <v-skeleton-loader type="list-item-avatar-three-line" min-width="300" class="mr-2" />
        <v-skeleton-loader type="list-item-avatar-three-line" min-width="300" class="mr-2" />
        <v-skeleton-loader type="list-item-avatar-three-line" min-width="300" class="mr-2" />
        <v-skeleton-loader type="list-item-avatar-three-line" min-width="300" />
      </v-col>

      <v-col class="history-ctn pb-12" cols="12" />
    </v-row>
  </v-container>

  <v-container v-else fluid class="py-0 full-height">
    <!-- First Row -->
    <v-row align="center" no-gutters class="my-3">
      <v-col
        cols="8" sm="6" lg="7" xl="8"
        class="jackpot-nav disp-flex flex-center-y flex-wrap lh-1 caption fw-semibold"
      >
        <div :class="{'active': game === 'elite'}" class="item game-btn cursor-pointer subtitle-2 d-flex flex-center pa-3 bdrd-1 ma-1" @click="setGame('elite')">
          <fai :class="{'primary--text': game === 'elite'}" class="mr-2" :icon="['fad', 'diamond']" /> Normal
          <v-spacer />
          ${{ tickers.potValues.elite | currencyInt }}
        </div>
        <div :class="{'active': game === 'silver'}" class="item game-btn cursor-pointer subtitle-2 d-flex flex-center pa-3 bdrd-1 ma-1" @click="setGame('silver')">
          <fai :class="{'primary--text': game === 'elite'}" class="mr-2" :icon="['fad', 'octagon']" /> 10 Max
          <v-spacer />
          ${{ tickers.potValues.silver | currencyInt }}
        </div>
      </v-col>
      <v-spacer />
      <v-col cols="4" sm="4" class="jackpot-nav disp-flex flex-center-y flex-wrap lh-1 caption fw-semibold">
        <div v-if="Object.keys(players).length > 1 && timer > 0" class="item subtitle-2 d-flex flex-center pa-3 bdrd-1 ma-1">
          <fai class="primary--text mr-2" :icon="['far', 'clock']" />Time Left
          <v-spacer />
          {{ timer }}s
        </div>
        <div v-else class="item subtitle-2 d-flex flex-center pa-3 bdrd-1 ma-1">
          <fai class="primary--text mr-2" :icon="['far', 'clock']" />{{ status }}
        </div>
        <div
          class="item subtitle-2 game-btn cursor-pointer pa-3 bdrd-1 ma-1" @click="$modal.open('jackpotHistory', { maxWidth: 900 }, { pot: currentPot})"
        >
          <fai :icon="['fas', 'history']" />
        </div>
        <div class="primary cursor-pointer text--text text-center item game-btn d-flex flex-center pa-3 bdrd-1 ma-1" @click="$modal.open('deposit', { maxWidth: 900 }, { pot: currentPot})">
          <fai :icon="['fas', 'plus']" /> <span class="subtitle-2 ml-2">Deposit</span>
        </div>
      </v-col>
    </v-row>

    <!-- Second Row -->

    <v-col cols="12" class="px-0 game-ctn">
      <transition-group
        v-dragscroll.x :name="focused ? 'v-items' : 'none'" mode="in-out" tag="div"
        class="items disp-flex mb-3 px-3 mr-2"
      >
        <div v-if="!sortedItems.length" :key="0" class="subtitle-1 faded-5">
          No items in pot
        </div>
        <Item
          v-for="item in sortedItems" :key="item.backpackId"
          :data="item" :user="playerData[item.userId]"
        />
      </transition-group>
    </v-col>

    <!-- Third Row: User Section -->
    <v-row>
      <v-col cols="6" md="3">
        <div class="jackpot-stats py-3 px-4 bdrd-1 d-flex flex-center-y">
          <fai :icon="['fas', 'users']" class="primary--text mr-2" /><span class="text--text subtitle-2 fw-regular">Users</span>
          <v-spacer />
          {{ Object.keys(players).length }}
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div class="jackpot-stats py-3 px-4 bdrd-1 d-flex flex-center-y">
          <fai :icon="['far', 'dollar-sign']" class="primary--text mr-2" /><span class="text--text subtitle-2 fw-regular">Pot Value</span>
          <v-spacer />
          {{ tickers.potValue | currencyInt }}
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div class="jackpot-stats py-3 px-4 bdrd-1 d-flex flex-center-y">
          <fai :icon="['fas', 'users']" class="primary--text mr-2" /><span class="text--text subtitle-2 fw-regular">Your Chance</span>
          <v-spacer />
          {{ +winChance.toFixed(3) }}%
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div class="jackpot-stats py-3 px-4 bdrd-1 d-flex flex-center-y">
          <img class="gun-icon primary--text mr-2" src="@/assets/img/gun-icon.png" alt="gun icon"><span class="text--text subtitle-2 fw-regular">Items</span>
          <v-spacer />
          {{ tickers.potItems }}
        </div>
      </v-col>
    </v-row>

    <!-- Forth Row -->
    <v-row class="pos-relative mb-6 py-0 px-3 bdrd-1">
      <!-- winner -->
      <v-col cols="12" class="winner-ctn">
        <transition name="v-winner">
          <div
            v-if="showWinner && winner"
            class="winner disp-flex flex-center" :style="{'--color': winner.color}"
          >
            <div class="px-2 py-1 d-flex flex-center flex-wrap flex-content-center">
              <div class="flex-no-shrink disp-flex flex-center-y link" @click="$userMenu.open($event, winner)">
                <v-img :src="winner.avatar" class="flex-no-grow bdrd-circle mr-2" width="32" contain />
                <span class="fw-bold mr-1 text--text">{{ winner.username | truncate(20) }}</span>
              </div>
              <span class="flex-no-shrink">won the pot valued at </span>
              <span class="no-wrap">

                <span class="fw-bold text--text mx-1">${{ potValue | currencyInt }}</span>
              </span>
              <span class="flex-no-shrink">with a chance of </span>
              <span class="fw-bold mx-1">{{ winner.winChance.toFixed(3) }}%</span>
              <!-- <fai :icon="['fab', 'twitter']" class="link ml-2 info--text" @click="tweet(game.winner.username, game.potValue, game.winner.winChance)" /> -->
            </div>
          </div>
        </transition>
      </v-col>

      <!-- timer -->
      <JackpotTimer v-model="timerValue" />

      <!-- entries / roll -->
      <v-col cols="12" class="pa-0 roll-ctn bdrd-1" :class="{rolling}">
        <div ref="rollSlider" class="roll-slider">
          <div
            v-for="c in rollClones" :key="c"
            class="inner-roll disp-flex flex-center-y" :style="{width: rollWidth + '%'}"
          >
            <div
              v-for="(bet, i) in bets" :key="i" class="entry headline"
              :style="{
                width: (bet.amount / potValue * 100) + '%',
                '--color': players[bet.userId].color
              }"
            >
              {{ bet.name }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Fifth Row -->
    <v-row>
      <transition-group
        :name="focused ? 'v-player' : 'none'" tag="div"
        class="players mb-4 align-center px-0"
      >
        <v-col
          v-for="bet in bets" :key="bet.id"
          cols="12" sm="6" lg="4" xl="3"
          class="player-ctn pt-0" :style="{'--color': players[bet.userId].color}"
        >
          <div class="player pl-3 grey500 bdrd-1 disp-flex flex-center-y" :style="{'--color': players[bet.userId].color}">
            <div class="disp-flex of-hidden flex-grow flex-center-y py-3">
              <v-img
                :src="players[bet.userId].avatar" class="flex-no-grow bdrd-circle mr-3 link" :aspect-ratio="1" width="40"
                @click="$userMenu.open($event, players[bet.userId])"
              />
              <div class="lh-1 of-hidden">
                <div class="body-2 fw-semibold text--text disp-flex flex-center-y link" @click="$userMenu.open($event, players[bet.userId])">
                  {{ players[bet.userId].username | truncate(16) }}
                  <v-tooltip top color="info">
                    <template v-slot:activator="{on}">
                      <fai v-if="players[bet.userId].rank === 1" :icon="['fas', 'badge-check']" class="ml-1 info--text" v-on="on" />
                    </template>
                    <div class="caption fw-bold">
                      Verified User
                    </div>
                  </v-tooltip>
                </div>
                <div class="caption disp-flex flex-center-y flex-wrap">
                  <span class="no-wrap disp-flex grey100--text fw-regular flex-center-y mr-1">
                    Deposited
                  </span>

                  <span class="no-wrap disp-flex flex-center-y">
                    ${{ bet.amount | currencyInt }}
                  </span>
                </div>
              </div>
            </div>
            <div class="d-flex flex-center percent mr-2">
              <div class="caption">
                {{ +((bet.amount / potValue) * 100).toFixed(2) }}%
              </div>
            </div>
          </div>
        </v-col>
      </transition-group>
    </v-row>

    <div class="grey100--text break-word px-4 text-center faded-5 caption mb-2">
      Round Hash (#{{ roundId }}): {{ pf.hash }}
    </div>


    <!-- HISTORY CONTAINER -->
    <v-col cols="12" class="history-ctn py-0">
      <v-divider />
      <div class="mt-4 title">
        <fai
          class="primary--text mr-2"
          :icon="['fas', 'history']"
        />
        Recent Rounds
      </div>

      <transition-group :name="focused ? 'v-history' : 'none'">
        <div v-for="game in pastGames" :key="game.id" class="history-game mb-5 pt-5">
          <!-- winner -->
          <div class="winner-ctn mb-4">
            <div class="winner disp-flex flex-center bdrd-1" :style="{'--color': game.winner.color}">
              <div class="px-2 py-1 d-flex flex-center flex-wrap flex-content-center">
                <div class="flex-no-shrink disp-flex flex-center-y link" @click="$userMenu.open($event, game.winner)">
                  <v-img :src="game.winner.avatar" class="flex-no-grow bdrd-circle mr-2" width="32" contain />
                  <span class="fw-bold mr-1 text--text">{{ game.winner.username | truncate(20) }}</span>
                </div>
                <span class="flex-no-shrink">won the pot valued at </span>
                <span class="no-wrap">

                  <span class="fw-bold text--text mx-1">${{ game.potValue | currencyInt }}</span>
                </span>
                <span class="flex-no-shrink">with a chance of </span>
                <span class="fw-bold mx-1">{{ game.winner.winChance.toFixed(3) }}%</span>
                <!-- <fai :icon="['fab', 'twitter']" class="link ml-2 info--text" @click="tweet(game.winner.username, game.potValue, game.winner.winChance)" /> -->
              </div>
            </div>
          </div>

          <RoundInfo :game="game" />
        </div>
      </transition-group>
    </v-col>
  </v-container>
</template>

<script src="./jackpot.js"></script>
<style lang="scss" scoped src="./jackpot.scss"></style>
