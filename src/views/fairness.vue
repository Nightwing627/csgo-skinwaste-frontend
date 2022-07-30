<template>
  <v-container class="pt-0 pt-lg-8 px-0 px-lg-3">
    <v-row no-gutters>
      <v-col class="py-0" cols="12">
        <v-card color="grey700" class="mx-auto pa-8 body-2" style="max-width: 1000px;">
          <h1 class="headline mb-2">
            How are game results generated fairly?
          </h1>

          <p class="faded-8">
            Our system uses a local random seed plus a random seed from a reputable 3rd party (RANDOM.ORG). By doing this, you are able to see the exact seed we request from Random.org, which will match up with the game's end time (when the game will roll).
          </p>

          <p class="faded-8">
            This system makes it impossible for anyone, including us or the third party, to predict the winning outcome and makes each round provable and legitimate.
          </p>


          <h3 class="title mb-2">
            Brief technical overview
          </h3>

          <p class="faded-8">
            When a game is started, we create the local random seed. We hash it and show it to you <b>before the game rolls</b> (under the players). You are able to use the hash to verify that the local random seed remained unchanged throughout the game.
            <br>
            <pre>
<code> function genGameHash (serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
  };</code>
            </pre>
          </p>

          <p class="faded-8">
            When we combine our local random seed with random.org's seed using ChanceJS. It returns us the chanceHash, which will be used to generate the outcome of the round.
            <code>const chanceHash = server_seed+'-'+random_seed</code>
          </p>

          <p class="faded-8">
            To calculate the winning outcome, we feed Chance with the chanceHash above. This gives us the winning percent and the roll.
            <code>const percent = new Chance(chanceHash).floating({ min:0, max: 100, fixed: 6 }) <br> const roll = jackpot_or_coinflip_sum * percent</code>
          </p>

          <h2 class="subtitle-2 mb-0">
            Coinflip
          </h2>
          <p class="faded-8">
            Coinflips work the same way. The T side always has the low ticket portion, while CT side has the high portion.
          </p>

          <h2 class="subtitle-2 mb-0">
            Roulette
          </h2>
          <p class="faded-8">
            To calculate the winning outcome, we feed ChanceJS with the chanceHash above. This gives us the winning index. Which will correlate to constant that will give the result.<br><br>
            <code>const WHEEL = [10,1,2,1,5,2,1,5,2,1,5,1,2,1,10,2,1,-7,1,2,1,20,1,2,5,1,2,1,10,1,40,5,1,2,1,2,1,2,5,1,2,10,1,-2,1,2,5,1,20,1,2,1,2,1,]; <br> const index = new Chance(chanceHash).integer({ min:0, max: 53 }) <br> const result = WHEEL[index]</code> <br><br>

            If the winning number is a mulitplier, then there is a bonus round. The only difference in getting the result is how the has is generated. We take the previous hash and then re-hash it like so.
            <br>
            <br>
            <code>const newHash = crypto.createHash('sha256').update(previousRoundHash).digest('hex'); <br> const index = new Chance(newHash).integer({ min:0, max: 53 }) <br> const result = WHEEL[index]</code>
          </p>

          <b> You can verify the round data yourself here: </b>
          <a target="_blank" href="https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview" class="link">https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview</a>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card color="grey900" class="mx-auto body-2" style="max-width: 1000px;">
          <v-card-title class="pa-0">
            <v-tabs
              v-model="tab"
              centered
              background-color="grey700"
            >
              <v-tab v-for="(history, pot) in histories" :key="pot" :ripple="false">
                {{ pot }} Pot
              </v-tab>
              <v-tab :ripple="false">
                Coinflip
              </v-tab>
            </v-tabs>
          </v-card-title>
          <v-card-text>
            <v-tabs-items v-model="tab">
              <v-tab-item v-for="(history, pot) in histories" :key="pot" class="grey900 pa-3">
                <div v-if="history">
                  <h3 class="subtitle-2 fw-bold text-uppercase primary--text mb-2">
                    Last {{ history.length }} pots
                  </h3>

                  <div
                    v-for="game in history" :key="game.roundId"
                    class="grey500 mb-2 bdrd-2 pa-4"
                  >
                    <v-row no-gutters align="center">
                      <v-col cols="12" sm="3" class="mb-3 mb-sm-0">
                        <h5 class="subtitle-2 lh-1 mb-1">
                          GAME #{{ game.roundId }}
                        </h5>
                        <div class="caption lh-1">
                          {{ new Date(game.rolledAt).toLocaleString($i18n.locale) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="7" class="mb-3 mb-sm-0">
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Hash:
                          </span>
                          <span class="faded-8">{{ game.pf.hash }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Ticket:
                          </span>
                          <span class="faded-8">{{ game.pf.ticket }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Roll:
                          </span>
                          <span class="faded-8">{{ game.pf.roll }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Seed:
                          </span>
                          <span class="faded-8">{{ game.pf.seed }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Random Hash:
                          </span>
                          <span class="faded-8">{{ game.pf.randomHash }}</span>
                        </div>
                        <div class="caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Pot Total:
                          </span>
                          <span class="faded-8">{{ game.pf.total }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="2" class="disp-flex flex-end-x">
                        <v-btn small color="secondary" @click="verify(game.pf)">
                          Verify
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-show="history.length === 30" class="caption text-center mt-3">
                    Please contact support if you would like to retrieve more pots.
                  </div>
                </div>
                <div v-else class="loaders pa-5">
                  <v-skeleton-loader class="mb-2" type="paragraph" />
                  <v-skeleton-loader class="mb-2" type="paragraph" />
                  <v-skeleton-loader type="paragraph" />
                </div>
              </v-tab-item>

              <!-- coinflip -->
              <v-tab-item class="grey900 pa-3">
                <div v-if="coinflipHistory">
                  <h3 class="subtitle-2 fw-bold text-uppercase primary--text mb-2">
                    Last {{ coinflipHistory.length }} Coinflips
                  </h3>

                  <div
                    v-for="game in coinflipHistory" :key="game.roundId"
                    class="grey500 mb-2 bdrd-2 pa-4"
                  >
                    <v-row no-gutters align="center">
                      <v-col cols="12" sm="3" class="mb-3 mb-sm-0">
                        <h5 class="subtitle-2 lh-1 mb-1">
                          GAME #{{ game.roundID }}
                        </h5>
                        <div class="caption lh-1">
                          {{ new Date(game.endTime).toLocaleString($i18n.locale) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="7" class="mb-3 mb-sm-0">
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Hash:
                          </span>
                          <span class="faded-8">{{ game.gameHash }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Ticket:
                          </span>
                          <span class="faded-8">{{ game.percent }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Roll:
                          </span>
                          <span class="faded-8">{{ game.roll }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Seed:
                          </span>
                          <span class="faded-8">{{ game.unencodedServerHash }}</span>
                        </div>
                        <div class="mb-1 caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Random Hash:
                          </span>
                          <span class="faded-8">{{ game.randomHash }}</span>
                        </div>
                        <div class="caption lh-1">
                          <span class="fw-bold text-uppercase">
                            Pot Total:
                          </span>
                          <span class="faded-8">{{ game.pot }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="2" class="disp-flex flex-end-x">
                        <v-btn small color="secondary" @click="verifyCf(game)">
                          Verify
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-show="coinflipHistory.length === 30" class="caption text-center mt-3">
                    Please contact support if you would like to retrieve more pots.
                  </div>
                </div>
                <div v-else class="loaders pa-5">
                  <v-skeleton-loader class="mb-2" type="paragraph" />
                  <v-skeleton-loader class="mb-2" type="paragraph" />
                  <v-skeleton-loader type="paragraph" />
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ViewFairness',
  data() {
    return {
      tab: 0
    }
  },
  metaInfo: {
    title: 'Fairness'
  },
  computed: {
    ...mapGetters({
      config: 'config',
      histories: 'jackpot/histories',
      coinflipHistory: 'coinflip/history'
    })
  },
  created() {
    if (!this.coinflipHistory) this.getCoinflipHistory()
  },
  methods: {
    ...mapActions({
      getCoinflipHistory: 'coinflip/getHistory'
    }),
    verify(pf) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${pf.seed}","random":"${pf.randomHash}","pot":${pf.total}}`
      const win = window.open(url, '_blank')
      win.focus()
    },
    verifyCf(game) {
      const url = `https://codesandbox.io/embed/ezskins-jackpot-provably-ohcr3?fontsize=14&hidenavigation=1&theme=dark&view=preview&initialpath=/?data={"seed":"${game.unencodedServerHash}","random":"${game.randomHash}","pot":${game.pot}}`
      const win = window.open(url, '_blank')
      win.focus()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
