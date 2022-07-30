import Provably from '../../../../../../backend/src/modules/Provably';
<template>
  <div v-if="chatOpen.open" class="disp-flex flex-column h100">
    <!-- header -->
    <div class="chat-header disp-flex flex-center-y flex-center-x px-4 py-2">
      <v-img
        class="logo cursor-pointer"
        :src="require('@/assets/img/logo-1.svg')"
        contain
        @click="$router.push({ name: 'home' }).catch(() => { })"
      />
    </div>
    <div class="chat-header disp-flex flex-center-y flex-between px-4" style="height: 50px">
      <h2 class="subtitle-1 fw-bold lh-1">
        Chat
      </h2>
      <div class="disp-flex">
        <a class="social-icon discord" target="_blank" title="Discord" href="https://discord.gg/CPVBZSQ">
          <!-- Discord Link -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="71"
            height="55"
            viewBox="0 0 71 55"
            fill="none"
            class="wh-1 block m-auto"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                fill="#ffffff"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="71" height="55" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a class="social-icon twitter" target="_blank" title="Twitter" href="https://twitter.com/skinwaste">
          <!-- Twitter Link -->
          <svg
            id="Logo"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 248 204"
            style="enable-background: new 0 0 248 204"
            xml:space="preserve"
            class="wh-1 block m-auto"
          >
            <g id="Logo_1_">
              <path
                id="white_background"
                class="st0"
                fill="#ffffff"
                d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04   C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66   c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64   c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76   c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26   c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"
              />
            </g>
          </svg>
        </a>
        <button class="social-icon coinparty" title="Coinparty" @click="$modal.open('coinpartyCreate', {maxWidth: 600})">
          <!-- Twitter Link -->
          <svg
            id="Logo"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 491.363 491.363"
            style="enable-background: new 0 0 491.363 491.363"
            xml:space="preserve"
            class="wh-1 block m-auto"
          >
            <path
              style="fill:#F4B844;" d="M376.424,114.808v54.857h-1.567c0,19.331-51.722,34.482-113.371,34.482
	c-23.51,0.522-47.543-2.09-70.531-7.837v1.567c-11.494-9.926-24.555-17.241-38.661-21.943v-1.045l-1.567-57.992
	c4.18,17.763,52.245,31.869,111.282,31.869s112.849-15.151,112.849-33.959L376.424,114.808L376.424,114.808z"
            />
            <path
              style="fill:#FEDB41;" d="M263.053,80.849c62.171,0,113.894,15.673,113.894,34.482s-52.245,33.959-113.894,33.959
	s-107.625-14.106-111.804-31.869v-2.09C150.726,96.522,200.882,80.849,263.053,80.849z"
            />
            <path
              style="fill:#E2A63B;" d="M272.457,326.4v43.886h-10.449c-22.988,0.522-45.976-2.09-68.441-7.314L192,361.404
	c14.629-13.061,25.078-29.78,31.347-48.065h2.612c10.971,1.045,22.988,1.567,35.004,1.567h10.971L272.457,326.4z"
            />
            <path
              style="fill:#F4B844;" d="M262.53,257.437l5.224,2.612c-0.522,1.045-0.522,2.09-0.522,3.135c0,1.567,0.522,3.135,1.045,4.702
	v49.11h-5.747c-13.061,0-26.122-0.522-37.616-1.567h-2.612c3.657-11.494,5.224-23.51,5.224-35.526c0-7.837-1.045-15.673-2.09-23.51
	h2.612C239.543,257.437,251.037,257.437,262.53,257.437z"
            />
            <g>
              <path
                style="fill:#E2A63B;" d="M190.955,196.31c22.988,5.747,47.02,8.359,70.531,7.837c61.649,0,113.371-15.151,113.371-34.482
		h1.567v61.649c-57.469,0-104.49,13.584-110.237,30.824l-4.702-2.612c-10.971,0-21.42-0.522-32.392-1.567h-2.612
		c-5.224-23.51-17.763-44.931-36.049-60.604L190.955,196.31z"
              />
              <path
                style="fill:#E2A63B;" d="M491.363,320.653v55.38c0,18.808-50.678,34.482-112.327,34.482s-110.759-15.151-110.759-33.959
		V326.4c8.359,16.196,53.812,28.735,108.669,28.735s112.849-15.673,112.849-34.482H491.363z"
              />
            </g>
            <path
              style="fill:#F4B844;" d="M491.363,266.318v54.335h-1.567c0,18.808-51.2,34.482-112.849,34.482s-100.31-12.539-109.714-28.735
	v-56.947c6.792,17.241,53.812,30.302,110.237,30.302s111.282-15.151,112.849-33.437H491.363z"
            />
            <g>
              <path
                style="fill:#FEDB41;" d="M265.665,269.453c-0.522-1.567-1.045-2.612-1.045-4.18c0-1.045,0-2.09,0.522-3.135
		c5.747-17.241,53.29-31.347,111.282-31.347h0.522c62.171,0,114.416,15.151,114.416,34.482v1.045
		c-1.567,18.286-53.29,33.959-114.416,33.959S272.457,286.694,265.665,269.453z"
              />
              <path
                style="fill:#FEDB41;" d="M229.094,257.959c1.045,7.314,2.09,15.151,2.09,22.465c0,11.494-1.567,22.988-4.702,33.437
		c-6.269,18.808-17.241,36.049-31.869,49.11c-20.375,18.808-47.02,29.257-74.71,29.257C58.253,396.408,4.441,349.91,0.261,287.739
		c-4.18-61.649,42.318-115.461,104.49-119.641c5.224-0.522,10.449-0.522,15.673,0c10.971,0,22.465,1.567,32.914,4.702
		c14.629,4.702,28.212,12.539,39.706,22.465C210.808,211.984,223.869,233.926,229.094,257.959z"
              />
            </g>
            <circle style="fill:#F4B844;" cx="115.2" cy="280.424" r="55.902" />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
          </svg>
        </button>
      </div>
      <div class="d-flex flex-center-y flex-center-x">
        <div class="blob" />
        <span class="subtitle-2 primary--text">
          {{
            onlineCount | intToLocale
          }}
        </span>
        <span class="subtitle-2 ml-1 primary300--text">Online</span>
      </div>
    </div>

    <!-- messages -->
    <div class="messages-ctn flex-grow">
      <div
        :class="{ active: scrollPaused && messages }"
        class="hover-hint secondary700 fw-semibold text-uppercase caption fw-bold py-1 px-3 bdrd-1"
      >
        Auto-scroll paused
      </div>

      <div
        class="d-flex d-sm-none mobile-btn pa-4 bdrd-tl-5 bdrd-bl-5 grey300"
        @click="closeChat()"
      >
        <fai fixed-width icon="comments" class="title primary--text" />
      </div>

      <transition-group
        class="messages pt-2 pb-1"
        :name="focused ? 'v-chat' : 'none'"
        tag="div"
        mode="out-in"
        @scroll.native="onScrollMessage"
      >
        <!-- preloaders -->
        <div v-if="messages === null" key="0" class="loader-messages mx-3">
          <v-skeleton-loader
            v-for="i in 10"
            :key="i"
            type="list-item-avatar-three-line"
            class="mb-3"
          />
        </div>

        <!-- actual messages -->
        <div
          v-for="message in messages"
          :key="message._id"
          class="message"
          :class="{
            tip: message.tip,
            emotes: message.emoteOnly
          }"
        >
          <announcement v-if="message.announcement" :message="message" />
          <tip-message v-else-if="message.tip" :message="message" />
          <user-message v-else :message="message" />
        </div>
      </transition-group>
    </div>

    <Coinparty />

    <!-- chat input -->
    <div
      v-if="$vuetify.breakpoint.xs"
      class="mobile-nav chat-input .grey100--text" app
      :hide-on-scroll="true"
      light background-color="grey500"
      color="primary"
      :grow="$vuetify.breakpoint.width < 400" height="64"
    >
      <div v-show="autocomplete.open" class="autocomplete grey500 pa-1">
        <!-- emote -->
        <div
          v-for="(name, i) in autocomplete.emotes"
          :key="i"
          class="listing px-2 py-1 disp-flex flex-center-y body-2"
          :class="{ selected: autocomplete.selected === i }"
          @click="replaceEmote(name)"
        >
          <emote :data="name" class="mr-2 title" />
          <span class="faded-8">:</span>
          <span>{{ name }}</span>
          <span class="faded-8">:</span>
        </div>
      </div>

      <div
        class="input-ctn pos-relative px-2 pt-3 disp-flex flex-center-y bdrd-2"
        :class="{ sending: sending }"
      >
        <v-text-field
          ref="input"
          v-model="input"
          flat
          solo
          dense
          hide-details
          background-color="grey700"
          color="grey100"
          :disabled="!user"
          :readonly="sending"
          :placeholder="
            user ? 'Enter your message here..' : 'Please log in to chat'
          "
          height="40"
          class="bdrd-2 subtitle-2 mr-3 grey100--text"
          append-icon="fas fa-paper-plane"
          type="text"
          @keypress="onKeypress"
          @keydown="onKeyDown"
        >
          <template v-slot:append>
            <fai class="cursor-pointer" :icon="['far', 'smile-wink']" @click="toggleEmojis()" />
          </template>
        </v-text-field>
        <v-btn class="primary" width="40" height="40" @click="send()">
          <fai :icon="['fas', 'paper-plane']" class="mx-3 send-btn title icon text--text" />
        </v-btn>
      </div>
    </div>

    <div v-if="user ? user.agreeChatRules : true" class="chat-input" :class="{hidden:$vuetify.breakpoint.xs}">
      <!-- Autocomplete -->
      <div v-show="autocomplete.open" class="autocomplete grey500 pa-1">
        <!-- emote -->
        <div
          v-for="(name, i) in autocomplete.emotes"
          :key="i"
          class="listing px-2 py-1 disp-flex flex-center-y body-2"
          :class="{ selected: autocomplete.selected === i }"
          @click="replaceEmote(name)"
        >
          <emote :data="name" class="mr-2 title" />
          <span class="faded-8">:</span>
          <span>{{ name }}</span>
          <span class="faded-8">:</span>
        </div>
      </div>

      <div
        class="input-ctn pos-relative px-2 pt-3 disp-flex flex-center-y bdrd-2"
        :class="{ sending: sending }"
      >
        <v-text-field
          ref="input"
          v-model="input"
          flat
          solo
          dense
          hide-details
          background-color="grey700"
          color="grey100"
          :disabled="!user"
          :readonly="sending"
          :placeholder="
            user ? 'Enter your message here..' : 'Please log in to chat'
          "
          height="40"
          class="bdrd-2 subtitle-2 mr-3 grey100--text"
          append-icon="fas fa-paper-plane"
          type="text"
          @keypress="onKeypress"
          @keydown="onKeyDown"
        >
          <template v-slot:append>
            <fai class="cursor-pointer" :icon="['far', 'smile-wink']" @click="toggleEmojis()" />
          </template>
        </v-text-field>
        <v-btn class="primary" width="40" height="40" @click="send()">
          <fai :icon="['fas', 'paper-plane']" class="mx-3 send-btn title icon text--text" />
        </v-btn>
      </div>

      <div
        class="grey700 mt-1 px-3 py-1 overline d-flex flex-center-y flex-center-x justify-space-around"
      >
        <router-link class="link grey100--text" :to="{ name: 'fairness' }">
          Provably Fair
        </router-link>
        <router-link class="link grey100--text" :to="{ name: 'faq' }">
          FAQ
        </router-link>
        <router-link class="link grey100--text" :to="{ name: 'terms' }">
          Terms of Service
        </router-link>
      </div>
    </div>
    <div v-else class="chat-rules grey900 pa-4">
      <h1 class="subtitle-1 fw-bold">
        Chat Rules
      </h1>
      <ol class="body-2">
        <li>Keep the chat civil.</li>
        <li>Avoid spamming.</li>
        <li>No homophobia/sexism/racism of any kind.</li>
        <li>Do not advertise other sites.</li>
        <li>Do not post unknown links or URLs.</li>
        <li>Do not advertise affiliate codes in chat.</li>
        <li>No begging or passive begging.</li>
        <li class="fw-bold">
          Enjoy your stay.
        </li>
      </ol>
      <div
        class="fw-bold caption danger--text my-3 lh-1"
      >
        Failure to follow these rules can result in a chat ban.
      </div>
      <v-btn
        depressed
        block
        color="primary"
        :loading="agreeing"
        class="text-unset"
        @click="agreeChatRules"
      >
        I agree
      </v-btn>
    </div>
  </div>
</template>

<script src="./chat.js" setup>

</script>

<style lang="scss" scoped src="./chat.scss">
</style>
