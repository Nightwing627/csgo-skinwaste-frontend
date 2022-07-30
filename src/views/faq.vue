<template>
  <v-container id="faq">
    <v-row no-gutters>
      <v-col class="pa-5" cols="12">
        <!-- <v-card color="grey700" class="mx-auto pa-8 body-2" style="max-width: 1000px;"> -->
        <h1 class="headline mb-6">
          <fai :icon="['far', 'question-circle']" class="primary--text mr-3" />
          Frequently Asked Questions
        </h1>

        <v-row justify="center">
          <v-expansion-panels accordion>
            <v-expansion-panel
              v-for="(item,i) in items"
              :key="i"
              class="my-1"
            >
              <v-expansion-panel-header>
                {{ item.title }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-5">
                <VueMarkdown class="body-2">
                  {{ item.content }}
                </VueMarkdown>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
        <!-- </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'FaqPage',
  components: {
    VueMarkdown
  },
  data() {
    return {
      items: [
        {
          title: 'What is Skinwaste?',
          // eslint-disable-next-line max-len
          content: 'Skinwaste is a provably fair site that offers fun game modes for users. We want to provide a place for people to chat and have fun during their free times. Any feedback to us is greatly encouraged and appreciated. We hope you have a good time!\n\rJackpot: Users deposit items into the pot. The win chance depends on the value deposited into the pot. The higher amount you deposit relative to the total value of the pot, the higher your win chance.\n\rCoinflip: You can create or join coinflips with your items. Note that the value of your items must be within the boundary of the other player’s value when joining a flip.'
        },
        {
          title: 'Is your provably fair system legitimate?',
          // eslint-disable-next-line max-len
          content: 'Our provably fair system is 100% legitimate, and the outcome of rounds cannot be modified or seen before it takes place. Therefore, site admins cannot ‘rig’ any round to take advantage of players. Please check the FAQ page for more details of our system and how it works.'
        },
        {
          title: 'Can I get sponsored?',
          // eslint-disable-next-line max-len
          content: 'We try to be as inclusive and supportive towards many streamers and content creators as possible. We do not have specific requirements for sponsorships, but you must have at least a general audience and following base. Please submit an inquiry to CONTACT@SKINWASTE.COM to see if you’re eligible for a partnership.'
        },
        {
          title: 'How does the affiliate system work?',
          // eslint-disable-next-line max-len
          content: 'You can set a referral code in your affiliates page which your friends can enter when they deposit. Your friend will receive a small percent bonus for their deposit while you receive a small percentage of their deposited amount. The rewards for this can be claimed in the affiliate/rewards page.'
        },
        {
          title: 'What is a "Coin Party"?',
          // eslint-disable-next-line max-len
          content: 'Players can throw a coin party by clicking on the coin icon on top of chat. Coins are rewarded at the end of the party to everyone who joined before the 2 minute time limit. During the 2 minute countdown, any user can contribute to the coin party and increase its total size. The total amount will be split evenly to every participant by the end of 2 minutes.'
        },
        {
          title: 'How much do I need to play before I can withdraw?',
          // eslint-disable-next-line max-len
          content: 'To prevent abuse of our system from traders and free rewards, users must with at least 50% of their deposits before being able to withdraw.'
        },
        {
          title: 'How do the values of items work? How are they priced?',
          // eslint-disable-next-line max-len
          content: 'You are entering games with virtual skins that do not have physical value. We display these virtual values as a USD price. The price of these items is fixed and are not affected by Steam item values. '
        },
        {
          title: 'How can I withdraw my winnings?',
          // eslint-disable-next-line max-len
          content: 'You can click on your profile and purchase CSGO skins using your balance via our WaxPeer system. You may also cash-out your balance via Ethereum.'
        },
        {
          title: 'What deposit methods are available?',
          // eslint-disable-next-line max-len
          content: 'We currently do NOT support deposits with fiat. However, we plan on implementing this later in the future. You can deposit using crypto and we offer tips on depositing with virtual skins as well.'
        },
        {
          title: 'I’ve found a bug on the site. How can I report it?',
          // eslint-disable-next-line max-len
          content: 'Please submit an email to CONTACT@SKINWASTE.COM or create a ticket on our Discord server. You may receive a bug bounty depending on the severity of the issue. Note that exploiting any glitches or bugs that affect games will result in a permanent ban without notice.'
        },
        {
          title: 'I’ve made a deposit and my balance still has not been credited.',
          // eslint-disable-next-line max-len
          content: 'Depending on the blockchain, transaction times may vary due to network congestion. If you still have not received your deposit after the required confirmations, contact support with our live chat system or submit an email request to CONTACT@SKINWASTE.COM. Please provide your Steam ID and a link to the blockchain transaction.'
        },
        {
          title: 'What is the house edge / rake for our game modes?',
          // eslint-disable-next-line max-len
          content: 'The edge on average ranges from 5-10% depending on the items in the total pot. If no items in the pot fall within that boundary, then the item will not be raked.'
        },
        {
          title: 'Can I cancel a coinflip after creating it? What about jackpot?',
          // eslint-disable-next-line max-len
          content: 'Yes, you can cancel coinflips.\n\rNo, you cannot take back your item after you deposit into the pot.'
        },
        {
          title: 'How does the daily reward system work?',
          // eslint-disable-next-line max-len
          content: 'Daily rewards are given based on level. Our current max level is 100. The higher the level, the higher your daily reward. However, you must deposit a certain amount every week and meet your level deposit threshold to claim the daily reward. This threshold resets every week. If you do not deposit in a week, you will move down by one level for every day you do not deposit, until you make a deposit that meets one of the thresholds. The max daily reward for the max level is currently at $1 per day. However, this is subject to change.'
        },
        {
          title: 'What is the fastest way to contact us?',
          // eslint-disable-next-line max-len
          content: 'The fastest way to contact us is through our live support. Click on the chat icon on the bottom right side of your screen to start a live chat with one of our agents. You may also reach us at CONTACT@SKINWASTE.COM.'
        },
        {
          title: 'Can I tip another user?',
          // eslint-disable-next-line max-len
          content: 'Yes, you can click on their chat profile and send a tip with your items. Note that we will not reverse any gifts/tips to other users.'
        },
        {
          title: 'What is the minimum deposit/withdrawal amount?',
          // eslint-disable-next-line max-len
          content: 'Our minimum deposit is $5 in value. However, you are in charge of any blockchain transaction fees that may occur.\n\rOur minimum withdraw amount for Ethereum cash-outs is $5. The blockchain transaction fees will be deducted from your balance.'
        },
        {
          title: 'I did not receive my withdrawal.',
          // eslint-disable-next-line max-len
          content: 'Please submit a request to support with your Steam ID or user ID. Note that if you have typed in the wrong address, we are not responsible for the loss of funds. Please double check before sending or receiving crypto.'
        },
        {
          title: 'How are your exchange rates calculated?',
          // eslint-disable-next-line max-len
          content: 'We fetch a live rate with CoinMarketCap API to get our exchange rates.'
        },
        {
          title: 'Can I apply for a chat moderator or any position at Skinwaste?',
          // eslint-disable-next-line max-len
          content: 'If we are looking for positions, we will make an announcement. Normally, we don’t accept random applications from players.'
        },
        {
          title: 'Someone claiming to be a Skinwaste staff has added me on Steam.',
          // eslint-disable-next-line max-len
          content: 'Beware of impersonators. Staff members will NEVER add you on Steam or any other social platforms claiming to be affiliated with us.'
        },
        {
          title: 'I have been muted or restricted from using the site.',
          // eslint-disable-next-line max-len
          content: 'Skinwaste is against racist/homophobic/sexist or any discriminating behavior against others or staff members. If you feel that you have been unfairly muted or banned, please submit an appeal request to our support.'
        },
        {
          title: 'I cannot login with Steam.',
          // eslint-disable-next-line max-len
          content: 'Since we use Steam as our authentication method, we cannot guarantee 100% uptime of Steam servers. During downtimes, you may be unable to sign in.'
        },
        {
          title: 'I think I have an addiction problem.',
          // eslint-disable-next-line max-len
          content: 'We only support healthy gaming on our platform. If you feel that you are going past your limits, please contact our support for self-exclusion.'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
$faq-color-primary: $grey700;
$faq-color-secondary: #3B4453;

#faq {
  .v-expansion-panel-header {
    background-color: $faq-color-primary;

    &.v-expansion-panel-header--active {
      font-weight: 700;
      background-color: $faq-color-secondary;
    }
  }

  .v-expansion-panel-content {
    background-color: $faq-color-primary;
  }
}
</style>
