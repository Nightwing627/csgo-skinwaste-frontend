<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <!-- v-if="!!status" -->
  <v-container class="loader-ctn py-0 full-height roulette">
    <v-row
      class="space"
      style="max-width: 1300px;
    width: 100%;
    margin: auto;"
    >
      <v-col col="12" md="4" class="space">
        <div class="history">
          <!-- <span>Previos Rolls:</span> -->
          <ul class="rolls">
            <li v-for="i in 20" v-if="history.length < 1" :key="'##' + i">
              <div class="tooltip past-roll">
                <span
                  class="tooltip-info"
                >
                  <span
                    class="tooltip-text"
                  ><span class="darken">Round Number</span></span>
                  <span
                    class="tooltip-text"
                  ><span class="darken">Winning Number</span></span>
                </span>
              </div>
            </li>
            <li v-for="roll in history.slice(0, 20)" :key="roll.gameHash">
              <div
                class="tooltip past-roll"
                :data-hash="roll.gameHash"
                :data-number="
                  parseInt(
                    `${roll.unencodedServerHash}-${roll.randomHash}`.substr(
                      0,
                      52 / 4
                    ),
                    16
                  ) % 32
                "
                :class="{
                  'past-roll--3x': roll.roll == 'purple',
                  'past-roll--5x': roll.roll == 'pink',
                  'past-roll--30x': roll.roll == 'gold'
                }"
              >
                <span
                  class="tooltip-info"
                  :class="{
                    'tooltip-info--3x': roll.roll == 'purple',
                    'tooltip-info--5x': roll.roll == 'pink',
                    'tooltip-info--30x': roll.roll == 'gold'
                  }"
                >
                  <span
                    class="tooltip-text"
                  ><span class="darken">Round Number</span><br>{{
                    roll.roundID
                  }}</span>
                  <span
                    class="tooltip-text"
                  ><span class="darken">Winning Number</span><br>{{
                    parseInt(
                      `${roll.unencodedServerHash}-${roll.randomHash}`.substr(
                        0,
                        52 / 4
                      ),
                      16
                    ) % 32
                  }}</span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </v-col>
      <v-col col="12" md="4" class="space space--left">
        <div class="last-rolls">
          <div class="title">
            LAST 100
          </div>
          <div class="last_roll">
            <div
              v-for="(last_roll, index) in last_rolls"
              :key="'###' + index"
              :class="`--${last_roll.color}`"
            >
              <div class="last-roll-number">
                {{ last_roll.amount }}
              </div>
            </div>
          </div>
        </div>
      </v-col>
      <v-col col="12" style="margin: auto;">
        <span>Hash:</span>
        <button class="hash" title="Click to Copy!" @click="copy">
          {{ $store.state.roulette.roulette.gameHash }}
        </button>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        col="12"
        class="center"
        style="max-width: 1300px;
    width: 100%;
    margin: auto;"
      >
        <div id="roulette-progress">
          <div id="roulette-progress-bar" />
        </div>
      </v-col>
    </v-row>
    <v-row class="center">
      <v-col
        class="disp-flex flex-center-y overflow-hidden"
        style="max-width:1300px; width:100%;"
      >
        <div class="roulette-container" style="max-width:1300px; width:100%;">
          <div class="roulette-indicator roulette-indicator--top" />
          <div class="roulette-wrapper">
            <div class="roulette-row">
              <div
                id="roulette-container"
                class="roulette-el-container"
                style="transform: translateX(-0px);"
              >
                <div class="roulette-row">
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--gold"
                    data-roulette-value="30x"
                  >
                    <div>30x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--pink"
                    data-roulette-value="5x"
                  >
                    <div>5x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--purple"
                    data-roulette-value="3x"
                  >
                    <div>3x</div>
                  </div>
                  <div
                    class="roulette-el noselect roulette-el--black"
                    data-roulette-value="2x"
                  >
                    <div>2x</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row class="bet-input">
      <v-row
        style="width:100%;justify-content:center; margin-bottom: 0.6em;"
        :style="
          `display:flex; ${
            this.$vuetify.breakpoint.mdAndDown
              ? 'flex-direction: row; max-width:800px;'
              : ''
          }`
        "
      >
        <div
          class="bet-input-container"
          :style="{
            'max-height': !this.$vuetify.breakpoint.mdAndDown ? '3em' : '',
            'margin': !this.$vuetify.breakpoint.mdAndDown ? 'auto 1em' : '',
            'flex-direction': !this.$vuetify.breakpoint.mdAndDown
              ? 'row'
              : 'column',
          }"
        >
          <div class="bet-input-wrapper">
            <fai
              :icon="['fas', 'dollar-sign']"
              class="primary--text title svg ml-2 mr-2"
            />
            <input
              v-model="betAmount"
              type="number"
              placeholder="Enter bet amount..."
              inputmode="decimal"
              autocomplete="off"
              step="0.01"
              class=""
            >
          </div>
          <div class="bet-buttons ml-2">
            <button style="text-transform:uppercase;" @click="clear">
              Clear
            </button>
            <button
              :class="{ hidden: $vuetify.breakpoint.mdAndDown }"
              @click="add(0.01)"
            >
              +0.01
            </button>
            <button
              :class="{ hidden: $vuetify.breakpoint.mdAndDown }"
              @click="add(0.1)"
            >
              +0.1
            </button>
            <button
              :class="{ hidden: $vuetify.breakpoint.mdAndDown }"
              @click="add(1)"
            >
              +1
            </button>
            <button
              :class="{ hidden: $vuetify.breakpoint.mdAndDown }"
              @click="add(10)"
            >
              +10
            </button>
            <button
              :class="{ hidden: $vuetify.breakpoint.mdAndDown }"
              @click="add(100)"
            >
              +100
            </button>
            <button @click="half">
              1/2
            </button>
            <button @click="double">
              2x
            </button>
            <button style="text-transform:uppercase;" @click="max">
              Max
            </button>
          </div>
        </div>
        <div
          class="bet-input-container"
          style="margin:auto 0;"
          :style="
            $vuetify.breakpoint.mdAndDown
              ? 'flex-direction :column !important;'
              : 'flex-direction :row !important;'
          "
        >
          <v-expansion-panels>
            <v-expansion-panel style="background-color:#2e3b49 !important;">
              <v-expansion-panel-header>
                Repeat Previous Bet
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="previousBets">
                <v-checkbox
                  v-model="repeatBets"
                  label="Repeat all bets"
                  color="success"
                  :value="true"
                  hide-details
                  style="margin-top:0 !important; margin-bottom:0.8em;"
                />
                <div class="previousBets">
                  <div
                    v-for="(bet, index) in previousBets"
                    :key="'#' + index"
                    class="previousBets-buttons-wrap"
                  >
                    <button
                      :class="`--${bet.field}`"
                      @click="
                        $store.state.roulette.status == 'open'
                          ? placeBetViaPrevButton(bet)
                          : null
                      "
                    >
                      {{ bet.amount }}
                    </button>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-row>
    </v-row>
    <v-row class="content-bets" no-gutters>
      <v-col
        v-for="(multiplier, index) in rouletteMultipliers"
        :key="index"
        cols="12"
        lg="3"
        md="6"
        sm="12"
        xs="1"
        class="px-1 py-1"
      >
        <div
          :class="
            `bets-${multiplier}-wrapper` +
              ' ' +
              `${
                $store.state.roulette.status != 'open' && winning !== multiplier
                  ? 'disabled'
                  : ''
              }`
          "
        >
          <div
            class="bets-buttons-wrap"
            @click="
              $store.state.roulette.status == 'open'
                ? placeBet(rouletteFields[index])
                : null
            "
          >
            <div :class="`bet-button bet-button--${multiplier}`">
              {{ multiplier }}
            </div>
            Place Bet
          </div>
          <div class="bets-total-container">
            <div class="bets-total-wrapper">
              <div class="bets-total-item">
                <img
                  :src="`/img/roulette/person${multiplier}.svg`"
                  class="svg person"
                ><span>{{ bets[multiplier].bets.length }} Users</span>
              </div>
              <div class="bets-total-item">
                <img
                  :src="`/img/roulette/coin${multiplier}.svg`"
                  class="svg"
                ><span>{{ bets[multiplier].total }}</span>
              </div>
            </div>
            <div v-if="$vuetify.breakpoint.lgAndUp" class="bets">
              <div
                v-for="bet in bets[multiplier].bets"
                :key="bet._id"
                class="bets-user"
              >
                <div class="user-avatar">
                  <v-avatar>
                    <img :src="bet.avatar">
                  </v-avatar>
                  <span class="ml-1">{{ bet.username }}</span>
                </div>
                <div class="user-bet">
                  <img
                    :src="`/img/roulette/coin${multiplier}.svg`"
                    class="svg"
                  ><span class="bet-amount">{{ bet.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./roulette.js"></script>
<style lang="scss" scoped src="./roulette.scss"></style>
<style lang="scss">
.v-input--hide-details > .v-input__control > .v-input__slot {
  justify-content: center;
}
</style>
